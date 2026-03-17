export default function UpdateFlowNodeRefsBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  /**
   * Update Lane#flowNodeRefs and FlowNode#lanes with every flow node
   * move/resize and lane move/resize. Groups elements to recompute containments
   * as efficient as possible.
   */

  // the update context
  var context;


  function initContext() {
    context = context || new UpdateContext();
    context.enter();

    return context;
  }

  function getContext() {
    if (!context) {
      throw new Error('out of bounds release');
    }

    return context;
  }

  function releaseContext() {

    if (!context) {
      throw new Error('out of bounds release');
    }

    var triggerUpdate = context.leave();

    if (triggerUpdate) {
      modeling.updateLaneRefs(context.flowNodes, context.lanes);

      context = null;
    }

    return triggerUpdate;
  }


  var laneRefUpdateEvents = [
    'spaceTool',
    'lane.add',
    'lane.resize',
    'lane.split',
    'elements.create',
    'elements.delete',
    'elements.move',
    'shape.create',
    'shape.delete',
    'shape.move',
    'shape.resize'
  ];


  // listen to a lot of stuff to group lane updates

  this.preExecute(laneRefUpdateEvents, HIGH_PRIORITY, function(event) {
    initContext();
  });

  this.postExecuted(laneRefUpdateEvents, LOW_PRIORITY, function(event) {
    releaseContext();
  });


  // Mark flow nodes + lanes that need an update

  this.preExecute([
    'shape.create',
    'shape.move',
    'shape.delete',
    'shape.resize'
  ], function(event) {

    var context = event.context,
        shape = context.shape;

    var updateContext = getContext();

    // no need to update labels
    if (shape.labelTarget) {
      return;
    }

    if (is(shape, 'bpmn:Lane')) {
      updateContext.addLane(shape);
    }

    if (is(shape, 'bpmn:FlowNode')) {
      updateContext.addFlowNode(shape);
    }
  });
}
