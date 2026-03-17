function __method_wrapper__() {
    _updateLayersCameraCoordinates(scale: float) {
      this._layersCameraCoordinates = this._layersCameraCoordinates || {};
      for (const name in this._layers.items) {
        if (this._layers.items.hasOwnProperty(name)) {
          const theLayer = this._layers.items[name];
          this._layersCameraCoordinates[name] = this._layersCameraCoordinates[
            name
          ] || [0, 0, 0, 0];
          this._layersCameraCoordinates[name][0] =
            theLayer.getCameraX() - (theLayer.getCameraWidth() / 2) * scale;
          this._layersCameraCoordinates[name][1] =
            theLayer.getCameraY() - (theLayer.getCameraHeight() / 2) * scale;
          this._layersCameraCoordinates[name][2] =
            theLayer.getCameraX() + (theLayer.getCameraWidth() / 2) * scale;
          this._layersCameraCoordinates[name][3] =
            theLayer.getCameraY() + (theLayer.getCameraHeight() / 2) * scale;
        }
      }
    }

}
