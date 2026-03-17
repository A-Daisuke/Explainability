class __C__ {
    updateFromNetworkSyncData(
      syncData: GameNetworkSyncData,
      options: UpdateFromNetworkSyncDataOptions
    ) {
      this._throwIfDisposed();
      if (syncData.var) {
        this._variables.updateFromNetworkSyncData(syncData.var, options);
      }
      if (syncData.sm) {
        this.getSoundManager().updateFromNetworkSyncData(syncData.sm);
      }
      if (syncData.ss) {
        this._sceneStack.updateFromNetworkSyncData(syncData.ss);
      }
      if (syncData.extVar) {
        for (const extensionName in syncData.extVar) {
          if (!syncData.extVar.hasOwnProperty(extensionName)) {
            continue;
          }
          const extensionVariablesData = syncData.extVar[extensionName];
          const extensionVariables =
            this.getVariablesForExtension(extensionName);
          if (extensionVariables) {
            extensionVariables.updateFromNetworkSyncData(
              extensionVariablesData,
              options
            );
          }
        }
      }
    }

}
