export default function AdaptiveLabelPositioningBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  this.postExecuted([
    'connection.create',
    'connection.layout',
    'connection.updateWaypoints'
  ], function(event) {
    var context = event.context,
        connection = context.connection,
        source = connection.source,
        target = connection.target,
        hints = context.hints || {};

    if (hints.createElementsBehavior !== false) {
      checkLabelAdjustment(source);
      checkLabelAdjustment(target);
    }
  });


  this.postExecuted([
    'label.create'
  ], function(event) {
    var context = event.context,
        shape = context.shape,
        hints = context.hints || {};

    if (hints.createElementsBehavior !== false) {
      checkLabelAdjustment(shape.labelTarget);
    }
  });


  this.postExecuted([
    'elements.create'
  ], function(event) {
    var context = event.context,
        elements = context.elements,
        hints = context.hints || {};

    if (hints.createElementsBehavior !== false) {
      elements.forEach(function(element) {
        checkLabelAdjustment(element);
      });
    }
  });

  function checkLabelAdjustment(element) {

    // skip non-existing labels
    if (!hasExternalLabel(element)) {
      return;
    }

    if (isConnection(element)) {
      return;
    }

    var optimalPosition = getOptimalPosition(element);

    // no optimal position found
    if (!optimalPosition) {
      return;
    }

    adjustLabelPosition(element, optimalPosition);
  }

  function adjustLabelPosition(element, orientation) {

    var elementMid = getMid(element),
        label = element.label,
        labelMid = getMid(label);

    // ignore labels that are being created
    if (!label.parent) {
      return;
    }

    var elementTrbl = asTRBL(element);

    var newLabelMid;

    switch (orientation) {
    case 'top':
      newLabelMid = {
        x: elementMid.x,
        y: elementTrbl.top - ELEMENT_LABEL_DISTANCE - label.height / 2
      };

      break;

    case 'left':

      newLabelMid = {
        x: elementTrbl.left - ELEMENT_LABEL_DISTANCE - label.width / 2,
        y: elementMid.y
      };

      break;

    case 'bottom':

      newLabelMid = {
        x: elementMid.x,
        y: elementTrbl.bottom + ELEMENT_LABEL_DISTANCE + label.height / 2
      };

      break;

    case 'right':

      newLabelMid = {
        x: elementTrbl.right + ELEMENT_LABEL_DISTANCE + label.width / 2,
        y: elementMid.y
      };

      break;
    }

    var delta = substract(newLabelMid, labelMid);

    modeling.moveShape(label, delta);
  }

}
