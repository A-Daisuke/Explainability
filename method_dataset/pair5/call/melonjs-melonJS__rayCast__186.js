class __C__ {
	rayCast(line, result = []) {
		let collisionCounter = 0;

		// retrieve a list of potential colliding objects from the game world
		const candidates = this.world.broadphase.retrieve(line);

		for (let i = candidates.length, objB; i--, (objB = candidates[i]); ) {
			// fast AABB check if both bounding boxes are overlaping
			if (objB.body && line.getBounds().overlaps(objB.getBounds())) {
				// go trough all defined shapes in B (if any)
				const bLen = objB.body.shapes.length;
				if (objB.body.shapes.length === 0) {
					continue;
				}

				const shapeA = line;

				// go through all defined shapes in B
				let indexB = 0;
				do {
					const shapeB = objB.body.getShape(indexB);

					// full SAT collision check
					if (
						SAT["test" + shapeA.type + shapeB.type].call(
							this,
							dummyObj, // a reference to the object A
							shapeA,
							objB, // a reference to the object B
							shapeB,
						)
					) {
						// we touched something !
						result[collisionCounter] = objB;
						collisionCounter++;
					}
					indexB++;
				} while (indexB < bLen);
			}
		}

		// cap result in case it was not empty
		result.length = collisionCounter;

		// return the list of colliding objects
		return result;
	}

}
