function __method_wrapper__() {
  registerEvent: function(
    eventType: string,
    renderFunction: ComponentType<EventRendererProps>
  ) {
    if (!this.components.hasOwnProperty(eventType)) {
      console.warn(
        'Tried to register renderer for events "' +
          eventType +
          '", but a renderer already exists.'
      );
      return;
    }

    this.components[eventType] = renderFunction;
  },

}
