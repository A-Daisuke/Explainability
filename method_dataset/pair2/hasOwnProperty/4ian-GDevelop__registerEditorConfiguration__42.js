const __obj__ = {
  registerEditorConfiguration: function(
    objectType: string,
    editorConfiguration: any
  ) {
    if (!editorConfiguration.component) {
      console.warn(
        `Tried to register editor configuration for object "${objectType}", but "component" property is not defined.`
      );
      return;
    }
    if (!editorConfiguration.createNewObject) {
      console.warn(
        `Tried to register editor configuration for object "${objectType}", but "createNewObject" property is not defined.`
      );
      return;
    }
    if (!editorConfiguration.castToObjectType) {
      console.warn(
        `Tried to register editor configuration for object "${objectType}", but "castToObjectType" property is not defined.`
      );
      return;
    }

    if (this.editorConfigurations.hasOwnProperty(objectType)) {
      console.warn(
        `Tried to register editor configuration for object "${objectType}", but an editor configuration already exists.`
      );
      return;
    }

    this.editorConfigurations[objectType] = editorConfiguration;
  },

};
