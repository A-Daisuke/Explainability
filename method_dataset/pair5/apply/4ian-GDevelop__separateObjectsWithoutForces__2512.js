function __method_wrapper__() {
    separateObjectsWithoutForces(objectsLists: ObjectsLists): void {
      //Prepare the list of objects to iterate over.
      const objects = gdjs.staticArray(
        RuntimeObject.prototype.separateObjectsWithoutForces
      );
      objects.length = 0;
      const lists = gdjs.staticArray2(
        RuntimeObject.prototype.separateObjectsWithoutForces
      );
      objectsLists.values(lists);
      for (let i = 0, len = lists.length; i < len; ++i) {
        objects.push.apply(objects, lists[i]);
      }
      for (let i = 0, len = objects.length; i < len; ++i) {
        if (objects[i].id != this.id) {
          if (this.getDrawableX() < objects[i].getDrawableX()) {
            this.setX(objects[i].getDrawableX() - this.getWidth());
          } else {
            if (
              this.getDrawableX() + this.getWidth() >
              objects[i].getDrawableX() + objects[i].getWidth()
            ) {
              this.setX(objects[i].getDrawableX() + objects[i].getWidth());
            }
          }
          if (this.getDrawableY() < objects[i].getDrawableY()) {
            this.setY(objects[i].getDrawableY() - this.getHeight());
          } else {
            if (
              this.getDrawableY() + this.getHeight() >
              objects[i].getDrawableY() + objects[i].getHeight()
            ) {
              this.setY(objects[i].getDrawableY() + objects[i].getHeight());
            }
          }
        }
      }
    }

}
