		function List(runner) {
			Base.call(this, runner);

			var self = this,
				stats = this.stats,
				total = runner.total;

			runner.on('start', function () {
				console.log(JSON.stringify(['start', {total: total}]));
			});

			runner.on('pass', function (test) {
				console.log(JSON.stringify(['pass', clean(test)]));
			});

			runner.on('fail', function (test, err) {
				console.log(JSON.stringify(['fail', clean(test)]));
			});

			runner.on('end', function () {
				process.stdout.write(JSON.stringify(['end', self.stats]));
			});
		}
