function __method_wrapper__() {
    updateObjectsForces(): void {
      for (const name in this._instances.items) {
        if (this._instances.items.hasOwnProperty(name)) {
          const list = this._instances.items[name];
          for (let j = 0, listLen = list.length; j < listLen; ++j) {
            const obj = list[j];
            if (!obj.hasNoForces()) {
              const averageForce = obj.getAverageForce();
              const elapsedTimeInSeconds = obj.getElapsedTime() / 1000;
              obj.setX(obj.getX() + averageForce.getX() * elapsedTimeInSeconds);
              obj.setY(obj.getY() + averageForce.getY() * elapsedTimeInSeconds);
              obj.updateForces(elapsedTimeInSeconds);
            }
          }
        }
      }
    }

}
