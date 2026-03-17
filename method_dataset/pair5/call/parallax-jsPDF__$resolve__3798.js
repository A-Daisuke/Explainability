        var $resolve = function $resolve(value) {
          var promise = this;
          var then;
          if (promise._d) return;
          promise._d = true;
          promise = promise._w || promise;

          try {
            if (promise === value)
              throw TypeError("Promise can't be resolved itself");

            if ((then = isThenable(value))) {
              microtask(function() {
                var wrapper = {
                  _w: promise,
                  _d: false
                };

                try {
                  then.call(
                    value,
                    ctx($resolve, wrapper, 1),
                    ctx($reject, wrapper, 1)
                  );
                } catch (e) {
                  $reject.call(wrapper, e);
                }
              });
            } else {
              promise._v = value;
              promise._s = 1;
              notify(promise, false);
            }
          } catch (e) {
            $reject.call(
              {
                _w: promise,
                _d: false
              },
              e
            );
          }
        };
