export default function BpmnUpdater(
    eventBus,
    bpmnFactory,
    connectionDocking
) {

  CommandInterceptor.call(this, eventBus);

  this._bpmnFactory = bpmnFactory;

  var self = this;


  // connection cropping //////////////////////

  // crop connection ends during create/update
  function cropConnection(e) {
    var context = e.context,
        hints = context.hints || {},
        connection;

    if (!context.cropped && hints.createElementsBehavior !== false) {
      connection = context.connection;
      connection.waypoints = connectionDocking.getCroppedWaypoints(connection);
      context.cropped = true;
    }
  }

  this.executed([
    'connection.layout',
    'connection.create'
  ], cropConnection);

  this.reverted([ 'connection.layout' ], function(e) {
    delete e.context.cropped;
  });



  // BPMN + DI update //////////////////////


  // update parent
  function updateParent(e) {
    var context = e.context;

    self.updateParent(context.shape || context.connection, context.oldParent);
  }

  function reverseUpdateParent(e) {
    var context = e.context;

    var element = context.shape || context.connection,

        // oldParent is the (old) new parent, because we are undoing
        oldParent = context.parent || context.newParent;

    self.updateParent(element, oldParent);
  }

  this.executed([
    'shape.move',
    'shape.create',
    'shape.delete',
    'connection.create',
    'connection.move',
    'connection.delete'
  ], ifBpmn(updateParent));

  this.reverted([
    'shape.move',
    'shape.create',
    'shape.delete',
    'connection.create',
    'connection.move',
    'connection.delete'
  ], ifBpmn(reverseUpdateParent));

  /*
   * ## Updating Parent
   *
   * When morphing a Process into a Collaboration or vice-versa,
   * make sure that both the *semantic* and *di* parent of each element
   * is updated.
   *
   */
  function updateRoot(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        children = oldRoot.children;

    forEach(children, function(child) {
      if (is(child, 'bpmn:BaseElement')) {
        self.updateParent(child);
      }
    });
  }

  this.executed([ 'canvas.updateRoot' ], updateRoot);
  this.reverted([ 'canvas.updateRoot' ], updateRoot);


  // update bounds
  function updateBounds(e) {
    var shape = e.context.shape;

    if (!is(shape, 'bpmn:BaseElement')) {
      return;
    }

    self.updateBounds(shape);
  }

  this.executed([ 'shape.move', 'shape.create', 'shape.resize' ], ifBpmn(function(event) {

    // exclude labels because they're handled separately during shape.changed
    if (event.context.shape.type === 'label') {
      return;
    }

    updateBounds(event);
  }));

  this.reverted([ 'shape.move', 'shape.create', 'shape.resize' ], ifBpmn(function(event) {

    // exclude labels because they're handled separately during shape.changed
    if (event.context.shape.type === 'label') {
      return;
    }

    updateBounds(event);
  }));

  // Handle labels separately. This is necessary, because the label bounds have to be updated
  // every time its shape changes, not only on move, create and resize.
  eventBus.on('shape.changed', function(event) {
    if (event.element.type === 'label') {
      updateBounds({ context: { shape: event.element } });
    }
  });

  // attach / detach connection
  function updateConnection(e) {
    self.updateConnection(e.context);
  }

  this.executed([
    'connection.create',
    'connection.move',
    'connection.delete',
    'connection.reconnect'
  ], ifBpmn(updateConnection));

  this.reverted([
    'connection.create',
    'connection.move',
    'connection.delete',
    'connection.reconnect'
  ], ifBpmn(updateConnection));


  // update waypoints
  function updateConnectionWaypoints(e) {
    self.updateConnectionWaypoints(e.context.connection);
  }

  this.executed([
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints',
  ], ifBpmn(updateConnectionWaypoints));

  this.reverted([
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints',
  ], ifBpmn(updateConnectionWaypoints));

  // update conditional/default flows
  this.executed('connection.reconnect', ifBpmn(function(event) {
    var context = event.context,
        connection = context.connection,
        oldSource = context.oldSource,
        newSource = context.newSource,
        connectionBo = getBusinessObject(connection),
        oldSourceBo = getBusinessObject(oldSource),
        newSourceBo = getBusinessObject(newSource);

    // remove condition from connection on reconnect to new source
    // if new source can NOT have condional sequence flow
    if (connectionBo.conditionExpression && !isAny(newSourceBo, [
      'bpmn:Activity',
      'bpmn:ExclusiveGateway',
      'bpmn:InclusiveGateway'
    ])) {
      context.oldConditionExpression = connectionBo.conditionExpression;

      delete connectionBo.conditionExpression;
    }

    // remove default from old source flow on reconnect to new source
    // if source changed
    if (oldSource !== newSource && oldSourceBo.default === connectionBo) {
      context.oldDefault = oldSourceBo.default;

      delete oldSourceBo.default;
    }
  }));

  this.reverted('connection.reconnect', ifBpmn(function(event) {
    var context = event.context,
        connection = context.connection,
        oldSource = context.oldSource,
        newSource = context.newSource,
        connectionBo = getBusinessObject(connection),
        oldSourceBo = getBusinessObject(oldSource),
        newSourceBo = getBusinessObject(newSource);

    // add condition to connection on revert reconnect to new source
    if (context.oldConditionExpression) {
      connectionBo.conditionExpression = context.oldConditionExpression;
    }

    // add default to old source on revert reconnect to new source
    if (context.oldDefault) {
      oldSourceBo.default = context.oldDefault;

      delete newSourceBo.default;
    }
  }));

  // update attachments
  function updateAttachment(e) {
    self.updateAttachment(e.context);
  }

  this.executed([ 'element.updateAttachment' ], ifBpmn(updateAttachment));
  this.reverted([ 'element.updateAttachment' ], ifBpmn(updateAttachment));


  // update BPMNLabel
  this.executed('element.updateLabel', ifBpmn(updateBPMNLabel));
  this.reverted('element.updateLabel', ifBpmn(updateBPMNLabel));

  function updateBPMNLabel(event) {
    const { element } = event.context,
          label = getLabel(element);
    const di = getDi(element),
          diLabel = di && di.get('label');

    if (isLabelExternal(element) || isPlane(element)) {
      return;
    }

    if (label && !diLabel) {
      di.set('label', bpmnFactory.create('bpmndi:BPMNLabel'));
    } else if (!label && diLabel) {
      di.set('label', undefined);
    }
  }
}
