const __obj__ = {
  getThumbnail: function(
    project: gdProject,
    objectConfiguration: gdObjectConfiguration
  ) {
    const objectType = objectConfiguration.getType();
    if (this.renderers.hasOwnProperty(objectType))
      return this.renderers[objectType].getThumbnail(
        project,
        ResourcesLoader,
        objectConfiguration
      );
    else if (project.hasEventsBasedObject(objectType)) {
      return RenderedCustomObjectInstance.getThumbnail(
        project,
        ResourcesLoader,
        objectConfiguration
      );
    } else {
      return this.renderers['unknownObjectType'].getThumbnail(
        project,
        ResourcesLoader,
        objectConfiguration
      );
    }
  },

};
