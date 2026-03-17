function __method_wrapper__() {
		plugin.patch(Renderable, "postDraw", function (renderer) {
			// call the original Renderable.postDraw function
			// biome-ignore lint/style/noArguments: <explanation>
			this._patched.apply(this, arguments);

			// increment the sprites counter
			if (typeof this.image !== "undefined") {
				_this.counters.inc("sprites");
			}

			// increment the bound counter
			_this.counters.inc("bounds");

			// increment the children counter
			if (this instanceof Container) {
				_this.counters.inc("children");
			}

			// don't do anything else if the panel is hidden
			if (_this.visible) {
				// omit following object as they are patched later through different methods
				// XXX TODO: make this patched method more generic at Renderable level
				if (
					!(this instanceof Entity) &&
					!(this.ancestor instanceof Entity) &&
					!(this instanceof Text) &&
					!(this instanceof BitmapText) &&
					!(this instanceof Camera2d) &&
					!(this instanceof ImageLayer)
				) {
					// draw the renderable bounding box
					if (
						_this.checkbox.renderHitBox.selected &&
						this.getBounds().isFinite()
					) {
						if (typeof this.ancestor !== "undefined") {
							renderer.save();
							if (!this.floating) {
								const absolutePosition = this.ancestor.getAbsolutePosition();
								renderer.translate(-absolutePosition.x, -absolutePosition.y);
							}
						}

						const bounds = this.getBounds();

						renderer.setColor("green");
						renderer.stroke(bounds);

						// the sprite mask if defined
						if (typeof this.mask !== "undefined") {
							renderer.setColor("orange");
							renderer.stroke(this.mask);
						}

						if (typeof this.body !== "undefined") {
							renderer.translate(bounds.x, bounds.y);

							renderer.setColor("orange");
							renderer.stroke(this.body.getBounds());

							// draw all defined shapes
							renderer.setColor("red");
							for (const shape of this.body.shapes) {
								renderer.stroke(shape);
								_this.counters.inc("shapes");
							}
							renderer.translate(-bounds.x, -bounds.y);
						}

						if (typeof this.ancestor !== "undefined") {
							renderer.restore();
						}
					}
				}
			}
		});

}
