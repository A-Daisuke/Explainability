class __C__ {
	pointerMove(event) {
		if (this.released === false) {
			const x = event.gameScreenX + event.width / 2;
			const y = event.gameScreenY + event.height / 2;
			// pointerMove is a global on the viewport, so check for coordinates
			if (this.getBounds().contains(x, y)) {
				// if any direction is active, update it if necessary
				if (this.cursors.left === true || this.cursors.right === true) {
					this.checkDirection.call(this, x, y);
				}
			} else {
				// release keys/joypad if necessary
				this.onRelease.call(this, event);
			}
		}
	}

}
