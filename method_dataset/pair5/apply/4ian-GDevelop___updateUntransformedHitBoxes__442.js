function __method_wrapper__() {
    _updateUntransformedHitBoxes() {
      this._isUntransformedHitBoxesDirty = false;

      this._untransformedHitBoxes.length = 0;
      let minX = Number.MAX_VALUE;
      let minY = Number.MAX_VALUE;
      let maxX = -Number.MAX_VALUE;
      let maxY = -Number.MAX_VALUE;
      for (const childInstance of this._instanceContainer.getAdhocListOfAllInstances()) {
        if (!childInstance.isIncludedInParentCollisionMask()) {
          continue;
        }
        Array.prototype.push.apply(
          this._untransformedHitBoxes,
          childInstance.getHitBoxes()
        );
        const childAABB = childInstance.getAABB();
        minX = Math.min(minX, childAABB.min[0]);
        minY = Math.min(minY, childAABB.min[1]);
        maxX = Math.max(maxX, childAABB.max[0]);
        maxY = Math.max(maxY, childAABB.max[1]);
      }
      if (minX === Number.MAX_VALUE) {
        // The unscaled size can't be 0 because setWidth and setHeight wouldn't
        // have any effect.
        minX = 0;
        minY = 0;
        maxX = 1;
        maxY = 1;
      }
      this._unrotatedAABB.min[0] = minX;
      this._unrotatedAABB.min[1] = minY;
      this._unrotatedAABB.max[0] = maxX;
      this._unrotatedAABB.max[1] = maxY;

      while (this.hitBoxes.length < this._untransformedHitBoxes.length) {
        this.hitBoxes.push(new gdjs.Polygon());
      }
      this.hitBoxes.length = this._untransformedHitBoxes.length;
    }

}
