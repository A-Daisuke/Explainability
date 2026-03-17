export default function LabelBehavior(
    eventBus, modeling, bpmnFactory,
    textRenderer) {

  CommandInterceptor.call(this, eventBus);

  // update label if name property was updated
  this.postExecute('element.updateProperties', onPropertyUpdate);
  this.postExecute('element.updateModdleProperties', e => {
    const elementBo = getBusinessObject(e.context.element);

    if (elementBo === e.context.moddleElement) {
      onPropertyUpdate(e);
    }
  });

  function onPropertyUpdate(e) {
    var context = e.context,
        element = context.element,
        properties = context.properties;

    if (NAME_PROPERTY in properties) {
      modeling.updateLabel(element, properties[NAME_PROPERTY]);
    }

    if (TEXT_PROPERTY in properties
        && is(element, 'bpmn:TextAnnotation')) {

      var newBounds = textRenderer.getTextAnnotationBounds(
        {
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height
        },
        properties[TEXT_PROPERTY] || ''
      );

      modeling.updateLabel(element, properties.text, newBounds);
    }
  }

  // create label shape after shape/connection was created
  this.postExecute([ 'shape.create', 'connection.create' ], function(e) {
    var context = e.context,
        hints = context.hints || {};

    if (hints.createElementsBehavior === false) {
      return;
    }

    var element = context.shape || context.connection;

    if (isLabel(element) || !isLabelExternal(element)) {
      return;
    }

    // only create label if attribute available
    if (!getLabel(element)) {
      return;
    }

    modeling.updateLabel(element, getLabel(element));
  });

  // update label after label shape was deleted
  this.postExecute('shape.delete', function(event) {
    var context = event.context,
        labelTarget = context.labelTarget,
        hints = context.hints || {};

    // check if label
    if (labelTarget && hints.unsetLabel !== false) {
      modeling.updateLabel(labelTarget, null, null, { removeShape: false });
    }
  });

  function getVisibleLabelAdjustment(event) {

    var context = event.context,
        connection = context.connection,
        label = connection.label,
        hints = assign({}, context.hints),
        newWaypoints = context.newWaypoints || connection.waypoints,
        oldWaypoints = context.oldWaypoints;


    if (typeof hints.startChanged === 'undefined') {
      hints.startChanged = !!hints.connectionStart;
    }

    if (typeof hints.endChanged === 'undefined') {
      hints.endChanged = !!hints.connectionEnd;
    }

    return getLabelAdjustment(label, newWaypoints, oldWaypoints, hints);
  }

  this.postExecute([
    'connection.layout',
    'connection.updateWaypoints'
  ], function(event) {
    var context = event.context,
        hints = context.hints || {};

    if (hints.labelBehavior === false) {
      return;
    }

    var connection = context.connection,
        label = connection.label,
        labelAdjustment;

    // handle missing label as well as the case
    // that the label parent does not exist (yet),
    // because it is being pasted / created via multi element create
    //
    // Cf. https://github.com/bpmn-io/bpmn-js/pull/1227
    if (!label || !label.parent) {
      return;
    }

    labelAdjustment = getVisibleLabelAdjustment(event);

    modeling.moveShape(label, labelAdjustment);
  });


  // keep label position on shape replace
  this.postExecute([ 'shape.replace' ], function(event) {
    var context = event.context,
        newShape = context.newShape,
        oldShape = context.oldShape;

    var businessObject = getBusinessObject(newShape);

    if (businessObject
      && isLabelExternal(businessObject)
      && oldShape.label
      && newShape.label) {
      newShape.label.x = oldShape.label.x;
      newShape.label.y = oldShape.label.y;
    }
  });


  // move external label after resizing
  this.postExecute('shape.resize', function(event) {

    var context = event.context,
        shape = context.shape,
        newBounds = context.newBounds,
        oldBounds = context.oldBounds;

    if (hasExternalLabel(shape)) {

      var label = shape.label,
          labelMid = getMid(label),
          edges = asEdges(oldBounds);

      // get nearest border point to label as reference point
      var referencePoint = getReferencePoint(labelMid, edges);

      var delta = getReferencePointDelta(referencePoint, oldBounds, newBounds);

      modeling.moveShape(label, delta);

    }

  });

}
