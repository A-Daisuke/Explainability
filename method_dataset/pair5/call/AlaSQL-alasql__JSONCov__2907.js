		function JSONCov(runner, output) {
			var self = this,
				output = 1 == arguments.length ? true : output;

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

			runner.on('fail', function (test) {
				failures.push(test);
			});

			runner.on('end', function () {
				var cov = global._$jscoverage || {};
				var result = (self.cov = map(cov));
				result.stats = self.stats;
				result.tests = tests.map(clean);
				result.failures = failures.map(clean);
				result.passes = passes.map(clean);
				if (!output) return;
				process.stdout.write(JSON.stringify(result, null, 2));
			});
		}
