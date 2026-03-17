		function HTMLCov(runner) {
			var jade = require('jade'),
				file = __dirname + '/templates/coverage.jade',
				str = fs.readFileSync(file, 'utf8'),
				fn = jade.compile(str, {filename: file}),
				self = this;

			JSONCov.call(this, runner, false);

			runner.on('end', function () {
				process.stdout.write(
					fn({
						cov: self.cov,
						coverageClass: coverageClass,
					})
				);
			});
		}
