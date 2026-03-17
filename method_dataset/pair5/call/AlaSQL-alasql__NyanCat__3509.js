		function NyanCat(runner) {
			Base.call(this, runner);
			var self = this,
				stats = this.stats,
				width = (Base.window.width * 0.75) | 0,
				rainbowColors = (this.rainbowColors = self.generateColors()),
				colorIndex = (this.colorIndex = 0),
				numerOfLines = (this.numberOfLines = 4),
				trajectories = (this.trajectories = [[], [], [], []]),
				nyanCatWidth = (this.nyanCatWidth = 11),
				trajectoryWidthMax = (this.trajectoryWidthMax = width - nyanCatWidth),
				scoreboardWidth = (this.scoreboardWidth = 5),
				tick = (this.tick = 0),
				n = 0;

			runner.on('start', function () {
				Base.cursor.hide();
				self.draw();
			});

			runner.on('pending', function (test) {
				self.draw();
			});

			runner.on('pass', function (test) {
				self.draw();
			});

			runner.on('fail', function (test, err) {
				self.draw();
			});

			runner.on('end', function () {
				Base.cursor.show();
				for (var i = 0; i < self.numberOfLines; i++) write('\n');
				self.epilogue();
			});
		}
