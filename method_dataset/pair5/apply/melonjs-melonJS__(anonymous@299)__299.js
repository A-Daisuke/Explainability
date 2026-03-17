function __method_wrapper__() {
		plugin.patch(Entity, "postDraw", function (renderer) {
			// don't do anything else if the panel is hidden
			if (_this.visible) {
				// check if debug mode is enabled
				if (_this.checkbox.renderHitBox.selected) {
					renderer.save();

					if (typeof this.ancestor !== "undefined") {
						// if this object of this renderable parent is not the root container
						if (!this.floating) {
							const absolutePosition = this.ancestor.getAbsolutePosition();
							renderer.translate(-absolutePosition.x, -absolutePosition.y);
						}
					}

					if (this.renderable instanceof Renderable) {
						const rbounds = this.renderable.getBounds();
						const rx = -rbounds.x - this.anchorPoint.x * rbounds.width;
						const ry = -rbounds.y - this.anchorPoint.y * rbounds.height;

						renderer.setColor("green");
						renderer.translate(rx, ry);
						renderer.stroke(rbounds);
						renderer.translate(-rx, -ry);
					}

					renderer.translate(this.body.getBounds().x, this.body.getBounds().y);

					renderer.translate(
						-this.anchorPoint.x * this.body.getBounds().width,
						-this.anchorPoint.y * this.body.getBounds().height,
					);

					// draw the bounding rect shape
					renderer.setColor("orange");
					renderer.stroke(this.body.getBounds());

					// draw all defined shapes
					renderer.setColor("red");
					for (const shape of this.body.shapes) {
						renderer.stroke(shape);
						_this.counters.inc("shapes");
					}

					renderer.restore();
				}

				if (
					_this.checkbox.renderVelocity.selected &&
					(this.body.vel.x || this.body.vel.y)
				) {
					const bounds = this.body.getBounds();
					const hWidth = bounds.width / 2;
					const hHeight = bounds.height / 2;

					renderer.save();
					renderer.setLineWidth(1);

					renderer.setColor("blue");
					renderer.translate(0, -hHeight);
					renderer.strokeLine(
						0,
						0,
						~~(this.body.vel.x * hWidth),
						~~(this.body.vel.y * hHeight),
					);
					_this.counters.inc("velocity");

					renderer.restore();
				}
			}
			// call the original Entity.postDraw function
			// biome-ignore lint/style/noArguments: <explanation>
			this._patched.apply(this, arguments);
		});

}
