		function XUnit(runner) {
			Base.call(this, runner);
			var stats = this.stats,
				tests = [],
				self = this;

			runner.on('pending', function (test) {
				tests.push(test);
			});

			runner.on('pass', function (test) {
				tests.push(test);
			});

			runner.on('fail', function (test) {
				tests.push(test);
			});

			runner.on('end', function () {
				console.log(
					tag(
						'testsuite',
						{
							name: 'Mocha Tests',
							tests: stats.tests,
							failures: stats.failures,
							errors: stats.failures,
							skipped: stats.tests - stats.failures - stats.passes,
							timestamp: new Date().toUTCString(),
							time: stats.duration / 1000 || 0,
						},
						false
					)
				);

				tests.forEach(test);
				console.log('</testsuite>');
			});
		}
