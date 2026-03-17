		function Progress(runner, options) {
			Base.call(this, runner);

			var self = this,
				options = options || {},
				stats = this.stats,
				width = (Base.window.width * 0.5) | 0,
				total = runner.total,
				complete = 0,
				max = Math.max,
				lastN = -1;

			// default chars
			options.open = options.open || '[';
			options.complete = options.complete || '▬';
			options.incomplete = options.incomplete || Base.symbols.dot;
			options.close = options.close || ']';
			options.verbose = false;

			// tests started
			runner.on('start', function () {
				console.log();
				cursor.hide();
			});

			// tests complete
			runner.on('test end', function () {
				complete++;
				var incomplete = total - complete,
					percent = complete / total,
					n = (width * percent) | 0,
					i = width - n;

				if (lastN === n && !options.verbose) {
					// Don't re-render the line if it hasn't changed
					return;
				}
				lastN = n;

				cursor.CR();
				process.stdout.write('\u001b[J');
				process.stdout.write(color('progress', '  ' + options.open));
				process.stdout.write(Array(n).join(options.complete));
				process.stdout.write(Array(i).join(options.incomplete));
				process.stdout.write(color('progress', options.close));
				if (options.verbose) {
					process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
				}
			});

			// tests are complete, output some stats
			// and the failures if any
			runner.on('end', function () {
				cursor.show();
				console.log();
				self.epilogue();
			});
		}
