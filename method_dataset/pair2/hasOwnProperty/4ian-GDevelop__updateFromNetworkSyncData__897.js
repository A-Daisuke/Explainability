function __method_wrapper__() {
    updateFromNetworkSyncData(
      syncData: LayoutNetworkSyncData,
      options: UpdateFromNetworkSyncDataOptions
    ) {
      if (syncData.color !== undefined) {
        this._backgroundColor = syncData.color;
      }
      if (syncData.layers) {
        for (const layerName in syncData.layers) {
          const layerData = syncData.layers[layerName];
          if (this.hasLayer(layerName)) {
            const layer = this.getLayer(layerName);
            layer.updateFromNetworkSyncData(layerData);
          }
        }
      }
      // Update variables before anything else, as they might be used
      // in other sync data (for instance in tweens).
      if (syncData.var) {
        this._variables.updateFromNetworkSyncData(syncData.var, options);
      }
      if (syncData.extVar) {
        for (const extensionName in syncData.extVar) {
          if (!syncData.extVar.hasOwnProperty(extensionName)) {
            continue;
          }
          const extensionVariablesData = syncData.extVar[extensionName];
          const extensionVariables =
            this._variablesByExtensionName.get(extensionName);
          if (extensionVariables) {
            extensionVariables.updateFromNetworkSyncData(
              extensionVariablesData,
              options
            );
          }
        }
      }
      if (syncData.time) {
        this._timeManager.updateFromNetworkSyncData(syncData.time);
      }
      if (syncData.once) {
        this._onceTriggers.updateNetworkSyncData(syncData.once);
      }

      gdjs.callbacksRuntimeSceneUpdateFromSyncData.forEach((callback) => {
        callback(this, syncData, options);
      });

      // Sync Async last, as it might depend on other data.
      if (syncData.async && this._idToCallbackMap) {
        this._asyncTasksManager.updateFromNetworkSyncData(
          syncData.async,
          this._idToCallbackMap,
          this,
          options
        );
      }
    }

}
