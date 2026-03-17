function __method_wrapper__() {
    separateObjectsWithForces(objectsLists: ObjectsLists): void {
      //Prepare the list of objects to iterate over.
      const objects = gdjs.staticArray(
        RuntimeObject.prototype.separateObjectsWithForces
      );
      objects.length = 0;
      const lists = gdjs.staticArray2(
        RuntimeObject.prototype.separateObjectsWithForces
      );
      objectsLists.values(lists);
      for (let i = 0, len = lists.length; i < len; ++i) {
        objects.push.apply(objects, lists[i]);
      }
      for (let i = 0, len = objects.length; i < len; ++i) {
        if (objects[i].id != this.id) {
          if (
            this.getDrawableX() + this.getCenterX() <
            objects[i].getDrawableX() + objects[i].getCenterX()
          ) {
            let av = this.hasNoForces() ? 0 : this.getAverageForce().getX();
            this.addForce(-av - 10, 0, 0);
          } else {
            let av = this.hasNoForces() ? 0 : this.getAverageForce().getX();
            this.addForce(-av + 10, 0, 0);
          }
          if (
            this.getDrawableY() + this.getCenterY() <
            objects[i].getDrawableY() + objects[i].getCenterY()
          ) {
            let av = this.hasNoForces() ? 0 : this.getAverageForce().getY();
            this.addForce(0, -av - 10, 0);
          } else {
            let av = this.hasNoForces() ? 0 : this.getAverageForce().getY();
            this.addForce(0, -av + 10, 0);
          }
        }
      }
    }

}
