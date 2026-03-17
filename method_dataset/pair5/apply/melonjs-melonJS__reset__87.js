class __C__ {
	reset() {
		// add all defined cameras
		this.settings.cameras.forEach((camera) => {
			this.cameras.set(camera.name, camera);
		});

		// empty or no default camera
		if (this.cameras.has("default") === false) {
			if (typeof default_camera === "undefined") {
				const width = renderer.width;
				const height = renderer.height;
				// new default camera instance
				default_camera = new Camera2d(0, 0, width, height);
			}
			this.cameras.set("default", default_camera);
		}

		// reset the game
		eventEmitter.emit(STAGE_RESET, this);

		// call the onReset Function
		this.onResetEvent.apply(this, arguments);
	}

}
