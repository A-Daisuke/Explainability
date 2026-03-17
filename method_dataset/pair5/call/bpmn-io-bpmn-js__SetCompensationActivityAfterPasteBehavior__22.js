export default function SetCompensationActivityAfterPasteBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  this.postExecuted('elements.create', function(event) {
    const context = event.context,
          elements = context.elements;

    // check if compensation activity is connected to compensation boundary event
    for (const element of elements) {
      if (isForCompensation(element) && !isConnectedToCompensationBoundaryEvent(element)) {
        modeling.updateProperties(element, { isForCompensation: undefined });
      }
    }
  });
}
