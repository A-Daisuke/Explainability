        var onUnhandled = function onUnhandled(promise) {
          task.call(global, function() {
            var value = promise._v;
            var unhandled = isUnhandled(promise);
            var result, handler, console;

            if (unhandled) {
              result = perform(function() {
                if (isNode) {
                  process.emit("unhandledRejection", value, promise);
                } else if ((handler = global.onunhandledrejection)) {
                  handler({
                    promise: promise,
                    reason: value
                  });
                } else if ((console = global.console) && console.error) {
                  console.error("Unhandled promise rejection", value);
                }
              });
              promise._h = isNode || isUnhandled(promise) ? 2 : 1;
            }

            promise._a = undefined;
            if (unhandled && result.e) throw result.v;
          });
        };
