		function JSONReporter(runner) {
			var self = this;
			Base.call(this, runner);

			var tests = [],
				failures = [],
				passes = [];

			runner.on('test end', function (test) {
				tests.push(test);
			});

			runner.on('pass', function (test) {
				passes.push(test);
			});

			runner.on('fail', function (test, err) {
				failures.push(test);
				if (err === Object(err)) {
					test.errMsg = err.message;
					test.errStack = err.stack;
				}
			});

			runner.on('end', function () {
				var obj = {
					stats: self.stats,
					tests: tests.map(clean),
					failures: failures.map(clean),
					passes: passes.map(clean),
				};
				runner.testResults = obj;

				process.stdout.write(JSON.stringify(obj, null, 2));
			});
		}
