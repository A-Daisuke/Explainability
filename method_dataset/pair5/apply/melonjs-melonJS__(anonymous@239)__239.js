function __method_wrapper__() {
		plugin.patch(BitmapText, "draw", function (renderer) {
			// call the original Sprite.draw function
			// biome-ignore lint/style/noArguments: <explanation>
			this._patched.apply(this, arguments);

			// draw the font rectangle
			if (
				_this.visible &&
				_this.checkbox.renderHitBox.selected &&
				this.name !== "debugPanelFont"
			) {
				const bounds = this.getBounds();

				if (typeof this.ancestor !== "undefined") {
					const ax = this.anchorPoint.x * bounds.width;
					const ay = this.anchorPoint.y * bounds.height;
					// translate back as the bounds position
					// is already adjusted to the anchor Point
					renderer.save();
					renderer.translate(ax, ay);
				}

				renderer.setColor("green");
				renderer.stroke(bounds);

				if (typeof this.ancestor !== "undefined") {
					renderer.restore();
				}
			}
		});

}
