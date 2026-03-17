function __method_wrapper__() {
		Runnable.prototype.run = function (fn) {
			var self = this,
				start = new Date(),
				ctx = this.ctx,
				finished,
				emitted;

			// Some times the ctx exists but it is not runnable
			if (ctx && ctx.runnable) ctx.runnable(this);

			// called multiple times
			function multiple(err) {
				if (emitted) return;
				emitted = true;
				self.emit('error', err || new Error('done() called multiple times'));
			}

			// finished
			function done(err) {
				var ms = self.timeout();
				if (self.timedOut) return;
				if (finished) return multiple(err);
				self.clearTimeout();
				self.duration = new Date() - start;
				finished = true;
				if (!err && self.duration > ms && self._enableTimeouts)
					err = new Error('timeout of ' + ms + 'ms exceeded');
				fn(err);
			}

			// for .resetTimeout()
			this.callback = done;

			// explicit async with `done` argument
			if (this.async) {
				this.resetTimeout();

				try {
					this.fn.call(ctx, function (err) {
						if (err instanceof Error || toString.call(err) === '[object Error]') return done(err);
						if (null != err) {
							if (Object.prototype.toString.call(err) === '[object Object]') {
								return done(new Error('done() invoked with non-Error: ' + JSON.stringify(err)));
							} else {
								return done(new Error('done() invoked with non-Error: ' + err));
							}
						}
						done();
					});
				} catch (err) {
					done(err);
				}
				return;
			}

			if (this.asyncOnly) {
				return done(new Error('--async-only option in use without declaring `done()`'));
			}

			// sync or promise-returning
			try {
				if (this.pending) {
					done();
				} else {
					callFn(this.fn);
				}
			} catch (err) {
				done(err);
			}

			function callFn(fn) {
				var result = fn.call(ctx);
				if (result && typeof result.then === 'function') {
					self.resetTimeout();
					result.then(
						function () {
							done();
						},
						function (reason) {
							done(reason || new Error('Promise rejected with no or falsy reason'));
						}
					);
				} else {
					done();
				}
			}
		};

}
