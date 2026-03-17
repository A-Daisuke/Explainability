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
