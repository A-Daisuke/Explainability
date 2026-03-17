function __method_wrapper__() {
		plugin.patch(Text, "draw", function (renderer) {
			// call the original Text.draw function
			// biome-ignore lint/style/noArguments: <explanation>
			this._patched.apply(this, arguments);

			if (_this.visible && _this.checkbox.renderHitBox.selected) {
				const bounds = this.getBounds();

				if (typeof this.ancestor !== "undefined") {
					renderer.save();

					// if this object of this renderable parent is not the root container
					if (!this.root && !this.ancestor.root && this.ancestor.isFloating) {
						const absolutePosition = this.ancestor.getAbsolutePosition();
						renderer.translate(-absolutePosition.x, -absolutePosition.y);
					}
				}

				renderer.setColor("green");
				renderer.stroke(bounds);

				if (typeof this.ancestor !== "undefined") {
					renderer.restore();
				}
			}
		});

}
