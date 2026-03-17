function __method_wrapper__() {
    onGameResolutionResized() {
      const oldGameResolutionOriginX = this.getViewportOriginX();
      const oldGameResolutionOriginY = this.getViewportOriginY();
      this._cachedGameResolutionWidth = this._runtimeGame
        ? this._runtimeGame.getGameResolutionWidth()
        : 0;
      this._cachedGameResolutionHeight = this._runtimeGame
        ? this._runtimeGame.getGameResolutionHeight()
        : 0;
      for (const name in this._layers.items) {
        if (this._layers.items.hasOwnProperty(name)) {
          const theLayer: gdjs.RuntimeLayer = this._layers.items[name];
          theLayer.onGameResolutionResized(
            oldGameResolutionOriginX,
            oldGameResolutionOriginY
          );
        }
      }
      this._renderer.onGameResolutionResized();
    }

}
