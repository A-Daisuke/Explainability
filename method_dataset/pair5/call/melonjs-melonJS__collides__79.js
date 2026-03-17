function __method_wrapper__() {
	collides(bodyA, bodyB, response = this.response) {
		// for each shape in body A
		for (
			let indexA = bodyA.shapes.length, shapeA;
			indexA--, (shapeA = bodyA.shapes[indexA]);
		) {
			// for each shape in body B
			for (
				let indexB = bodyB.shapes.length, shapeB;
				indexB--, (shapeB = bodyB.shapes[indexB]);
			) {
				// full SAT collision check
				if (
					SAT["test" + shapeA.type + shapeB.type].call(
						this,
						bodyA.ancestor, // a reference to the object A
						shapeA,
						bodyB.ancestor, // a reference to the object B
						shapeB,
						// clear response object before reusing
						response.clear(),
					) === true
				) {
					// set the shape index
					response.indexShapeA = indexA;
					response.indexShapeB = indexB;

					return true;
				}
			}
		}
		return false;
	}

}
