export default function RemoveElementBehavior(eventBus, bpmnRules, modeling) {

  CommandInterceptor.call(this, eventBus);

  /**
   * Combine sequence flows when deleting an element
   * if there is one incoming and one outgoing
   * sequence flow
   */
  this.preExecute('shape.delete', function(e) {

    var shape = e.context.shape;

    // only handle [a] -> [shape] -> [b] patterns
    if (shape.incoming.length !== 1 || shape.outgoing.length !== 1) {
      return;
    }

    var inConnection = shape.incoming[0],
        outConnection = shape.outgoing[0];

    // only handle sequence flows
    if (!is(inConnection, 'bpmn:SequenceFlow') || !is(outConnection, 'bpmn:SequenceFlow')) {
      return;
    }

    if (bpmnRules.canConnect(inConnection.source, outConnection.target, inConnection)) {

      // compute new, combined waypoints
      var newWaypoints = getNewWaypoints(inConnection.waypoints, outConnection.waypoints);

      modeling.reconnectEnd(inConnection, outConnection.target, newWaypoints);
    }
  });

}
