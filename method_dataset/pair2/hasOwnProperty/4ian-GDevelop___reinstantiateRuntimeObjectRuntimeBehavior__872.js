function __method_wrapper__() {
    _reinstantiateRuntimeObjectRuntimeBehavior(
      behaviorData: BehaviorData,
      runtimeObject: gdjs.RuntimeObject
    ): void {
      const behaviorName = behaviorData.name;
      const oldRuntimeBehavior = runtimeObject.getBehavior(behaviorName);
      if (!oldRuntimeBehavior) {
        return;
      }

      // Remove and re-add the behavior so that it's using the newly
      // registered gdjs.RuntimeBehavior.
      runtimeObject.removeBehavior(behaviorName);
      runtimeObject.addNewBehavior(behaviorData);
      const newRuntimeBehavior = runtimeObject.getBehavior(behaviorName);
      if (!newRuntimeBehavior) {
        this._logs.push({
          kind: 'error',
          message:
            'Could not create behavior ' +
            behaviorName +
            ' (type: ' +
            behaviorData.type +
            ') for object ' +
            runtimeObject.getName(),
        });
        return;
      }

      // Copy the properties from the old behavior to the new one.
      for (let behaviorProperty in oldRuntimeBehavior) {
        if (!oldRuntimeBehavior.hasOwnProperty(behaviorProperty)) {
          continue;
        }
        if (behaviorProperty === '_behaviorData') {
          // For property "_behaviorData"  that we know to be an object,
          // do a copy of each property of
          // this object so that we keep the new ones (useful if a new property was added).
          newRuntimeBehavior[behaviorProperty] =
            newRuntimeBehavior[behaviorProperty] || {};
          for (let property in oldRuntimeBehavior[behaviorProperty]) {
            newRuntimeBehavior[behaviorProperty][property] =
              oldRuntimeBehavior[behaviorProperty][property];
          }
        } else {
          newRuntimeBehavior[behaviorProperty] =
            oldRuntimeBehavior[behaviorProperty];
        }
      }
      return;
    }

}
