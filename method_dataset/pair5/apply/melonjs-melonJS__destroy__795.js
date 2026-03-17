class __C__ {
	destroy() {
		// allow recycling object properties
		matrix2dPool.release(this.currentTransform);
		this.currentTransform = undefined;

		this.anchorPoint.revoke();
		this.anchorPoint = undefined;

		this.pos = undefined;

		if (typeof this._absPos !== "undefined") {
			vector2dPool.release(this._absPos);
			this._absPos = undefined;
		}

		if (this._bounds instanceof Bounds) {
			boundsPool.release(this._bounds);
			this._bounds = undefined;
		}

		this.onVisibilityChange = undefined;

		if (typeof this.mask !== "undefined") {
			pool.push(this.mask);
			this.mask = undefined;
		}

		if (this._tint instanceof Color) {
			colorPool.release(this._tint);
			this._tint = undefined;
		}

		// cannot import and reference a Container from a Renderable, since Container extends Renderable, creating a circular dependency
		//if (this.ancestor instanceof Container || this.ancestor instanceof Entity) {
		this.ancestor = undefined;

		// cannot import and reference a Application from a Renderable, messsing up class order in the bundle
		//if (this._parentApp instanceof Application) {
		this._parentApp = undefined;
		//}

		// destroy the physic body if a builtin body object
		if (this.body instanceof Body) {
			this.body.destroy.apply(this.body, arguments);
			this.body = undefined;
		}

		// release all registered events
		releaseAllPointerEvents(this);

		// call the user defined destroy method
		this.onDestroyEvent.apply(this, arguments);

		// destroy any shader object if not done by the user through onDestroyEvent()
		if (this.shader instanceof GLShader) {
			this.shader.destroy();
			this.shader = undefined;
		}
	}

}
