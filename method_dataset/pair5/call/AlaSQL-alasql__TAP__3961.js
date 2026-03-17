		function TAP(runner) {
			Base.call(this, runner);

			var self = this,
				stats = this.stats,
				n = 1,
				passes = 0,
				failures = 0;

			runner.on('start', function () {
				var total = runner.grepTotal(runner.suite);
				console.log('%d..%d', 1, total);
			});

			runner.on('test end', function () {
				++n;
			});

			runner.on('pending', function (test) {
				console.log('ok %d %s # SKIP -', n, title(test));
			});

			runner.on('pass', function (test) {
				passes++;
				console.log('ok %d %s', n, title(test));
			});

			runner.on('fail', function (test, err) {
				failures++;
				console.log('not ok %d %s', n, title(test));
				if (err.stack) console.log(err.stack.replace(/^/gm, '  '));
			});

			runner.on('end', function () {
				console.log('# tests ' + (passes + failures));
				console.log('# pass ' + passes);
				console.log('# fail ' + failures);
			});
		}
