function __method_wrapper__() {
  createNewInstanceRenderer: function(
    project: gdProject,
    instance: gdInitialInstance,
    associatedObjectConfiguration: gdObjectConfiguration,
    pixiContainer: PIXI.Container,
    threeGroup: THREE.Group | null,
    getPropertyOverridings: (() => Map<string, string>) | null = null
  ): RenderedInstance | Rendered3DInstance {
    const objectType = associatedObjectConfiguration.getType();
    if (threeGroup && this.renderers3D.hasOwnProperty(objectType)) {
      return new this.renderers3D[objectType](
        project,
        instance,
        associatedObjectConfiguration,
        pixiContainer,
        threeGroup,
        PixiResourcesLoader
      );
    } else if (this.renderers.hasOwnProperty(objectType))
      return new this.renderers[objectType](
        project,
        instance,
        associatedObjectConfiguration,
        pixiContainer,
        PixiResourcesLoader,
        getPropertyOverridings
      );
    else {
      if (project.hasEventsBasedObject(objectType)) {
        const eventsBasedObject = project.getEventsBasedObject(objectType);
        if (
          eventsBasedObject.isRenderedIn3D() &&
          eventsBasedObject.isAnimatable() &&
          eventsBasedObject.getObjects().getObjectsCount() === 0
        ) {
          return new RenderedSprite3DInstance(
            project,
            instance,
            associatedObjectConfiguration,
            pixiContainer,
            threeGroup,
            PixiResourcesLoader
          );
        } else if (eventsBasedObject.isUsingLegacyInstancesRenderer()) {
          return new LegacyRenderedCustomObjectInstance(
            project,
            instance,
            associatedObjectConfiguration,
            pixiContainer,
            threeGroup,
            PixiResourcesLoader
          );
        } else {
          return new RenderedCustomObjectInstance(
            project,
            instance,
            associatedObjectConfiguration,
            pixiContainer,
            threeGroup,
            PixiResourcesLoader,
            getPropertyOverridings
          );
        }
      }

      console.warn(
        `Object with type ${objectType} has no instance renderer registered. Please use registerInstanceRenderer to register your renderer.`
      );
      return new this.renderers['unknownObjectType'](
        project,
        instance,
        associatedObjectConfiguration,
        pixiContainer,
        PixiResourcesLoader
      );
    }
  },

}
