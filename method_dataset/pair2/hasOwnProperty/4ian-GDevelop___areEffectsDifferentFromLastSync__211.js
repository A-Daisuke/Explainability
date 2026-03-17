function __method_wrapper__() {
    private _areEffectsDifferentFromLastSync(effectsSyncData: {
      [effectName: string]: EffectNetworkSyncData;
    }) {
      if (!this._lastSentEffectSyncData) {
        return true;
      }

      for (const effectName in effectsSyncData) {
        if (!effectsSyncData.hasOwnProperty(effectName)) {
          continue;
        }

        const effectSyncData = effectsSyncData[effectName];
        const effectEnabled = effectSyncData.ena;
        const effectFilterCreator = effectSyncData.fc;

        const effectInLastSync = this._lastSentEffectSyncData[effectName];

        if (!effectInLastSync || effectInLastSync.ena !== effectEnabled) {
          return true;
        }

        for (const parameterName in effectFilterCreator) {
          if (!effectFilterCreator.hasOwnProperty(parameterName)) {
            continue;
          }

          const parameterValue = effectFilterCreator[parameterName];
          const lastParameterValueSent = effectInLastSync.fc[parameterName];
          if (lastParameterValueSent !== parameterValue) {
            return true;
          }
        }
      }

      return false;
    }

}
