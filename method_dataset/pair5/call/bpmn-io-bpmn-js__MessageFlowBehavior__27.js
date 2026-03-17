export default function MessageFlowBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  this.postExecute('shape.replace', function(context) {
    var oldShape = context.oldShape,
        newShape = context.newShape;

    if (!isParticipantCollapse(oldShape, newShape)) {
      return;
    }

    var messageFlows = getMessageFlows(oldShape);

    messageFlows.incoming.forEach(function(incoming) {
      var anchor = getResizedTargetAnchor(incoming, newShape, oldShape);

      modeling.reconnectEnd(incoming, newShape, anchor);
    });

    messageFlows.outgoing.forEach(function(outgoing) {
      var anchor = getResizedSourceAnchor(outgoing, newShape, oldShape);

      modeling.reconnectStart(outgoing, newShape, anchor);
    });
  }, true);

}
