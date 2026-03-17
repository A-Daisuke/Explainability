const __obj__ = {
  registerInstanceRenderer: function(objectType: string, renderer: any) {
    if (!renderer.getThumbnail) {
      console.warn(
        `Tried to register renderer for object "${objectType}", but getThumbnail is not defined.`
      );
      return;
    }

    if (this.renderers.hasOwnProperty(objectType)) {
      console.warn(
        `Tried to register renderer for object "${objectType}", but a renderer already exists.`
      );

      // If you want to update a renderer, this is currently unsupported.
      // To implement this, we need to add support for instance renderers to be released/destroyed
      // (some can have reference counting for some PIXI resources, etc... that would need to be properly released).
      return;
    }

    this.renderers[objectType] = renderer;
  },

};
