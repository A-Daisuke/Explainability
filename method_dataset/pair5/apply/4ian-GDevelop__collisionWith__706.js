function __method_wrapper__() {
    collisionWith(otherObjectsTable) {
      if (this._box2DBody === null) {
        this.createBody();
      }

      //Getting a list of all objects which are tested
      const objects = gdjs.staticArray(
        PhysicsRuntimeBehavior.prototype.collisionWith
      );
      objects.length = 0;
      const objectsLists = gdjs.staticArray2(
        PhysicsRuntimeBehavior.prototype.collisionWith
      );
      otherObjectsTable.values(objectsLists);
      for (let i = 0, len = objectsLists.length; i < len; ++i) {
        objects.push.apply(objects, objectsLists[i]);
      }

      //Test if an object of the list is in collision with our object.
      for (let i = 0, len = objects.length; i < len; ++i) {
        for (let j = 0, lenj = this.currentContacts.length; j < lenj; ++j) {
          if (this.currentContacts[j].owner.id === objects[i].id) {
            return true;
          }
        }
      }
      return false;
    }

}
