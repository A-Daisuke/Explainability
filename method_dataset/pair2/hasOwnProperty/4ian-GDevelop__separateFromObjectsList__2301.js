function __method_wrapper__() {
    separateFromObjectsList(
      objectsLists: ObjectsLists,
      ignoreTouchingEdges: boolean
    ): boolean {
      let moveXArray: Array<float> = separateFromObjectsStatics.moveXArray;
      let moveYArray: Array<float> = separateFromObjectsStatics.moveYArray;
      moveXArray.length = 0;
      moveYArray.length = 0;

      // We can assume that the moving object is not grid based
      // So there is no need for optimization
      // getHitBoxes can be called directly.
      const hitBoxes = this.getHitBoxes();
      let aabb: AABB | null = null;

      for (const name in objectsLists.items) {
        if (objectsLists.items.hasOwnProperty(name)) {
          const otherObjects = objectsLists.items[name];

          // Check if their is a collision with each object
          for (const otherObject of otherObjects) {
            if (otherObject.id === this.id) {
              continue;
            }
            let otherHitBoxesArray = otherObject.getHitBoxes();
            let otherHitBoxes: Iterable<gdjs.Polygon> = otherHitBoxesArray;
            if (otherHitBoxesArray.length > 4) {
              // The other object has a lot of hit boxes.
              // Try to reduce the amount of hitboxes to check.
              if (!aabb) {
                aabb = this.getAABB();
              }
              otherHitBoxes = otherObject.getHitBoxesAround(
                aabb.min[0],
                aabb.min[1],
                aabb.max[0],
                aabb.max[1]
              );
            }
            for (const hitBox of hitBoxes) {
              for (const otherHitBox of otherHitBoxes) {
                const result = gdjs.Polygon.collisionTest(
                  hitBox,
                  otherHitBox,
                  ignoreTouchingEdges
                );
                if (result.collision) {
                  moveXArray.push(result.move_axis[0]);
                  moveYArray.push(result.move_axis[1]);
                }
              }
            }
          }
        }
      }
      return moveFollowingSeparatingVectors(this, moveXArray, moveYArray);
    }

}
