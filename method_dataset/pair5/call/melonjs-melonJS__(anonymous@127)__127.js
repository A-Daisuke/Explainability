function __method_wrapper__() {
		candidates.forEach((objB) => {
			// check if both objects "should" collide
			if (this.shouldCollide(objA, objB)) {
				boundsB.addBounds(objB.getBounds(), true);
				boundsB.addBounds(objB.body.getBounds());

				// fast AABB check if both bounding boxes are overlaping
				if (boundsA.overlaps(boundsB)) {
					if (this.collides(objA.body, objB.body)) {
						// we touched something !
						collisionCounter++;

						// execute the onCollision callback
						if (
							objA.onCollision &&
							objA.onCollision(this.response, objB) !== false &&
							objA.body.isStatic === false
						) {
							objA.body.respondToCollision.call(objA.body, this.response);
						}
						if (
							objB.onCollision &&
							objB.onCollision(this.response, objA) !== false &&
							objB.body.isStatic === false
						) {
							objB.body.respondToCollision.call(objB.body, this.response);
						}
					}
				}
			}
		});

}
