              function invoke(method, arg, resolve, reject) {
                var record = tryCatch(generator[method], generator, arg);

                if (record.type === "throw") {
                  reject(record.arg);
                } else {
                  var result = record.arg;
                  var value = result.value;

                  if (
                    value &&
                    _typeof(value) === "object" &&
                    hasOwn.call(value, "__await")
                  ) {
                    return Promise.resolve(value.__await).then(
                      function(value) {
                        invoke("next", value, resolve, reject);
                      },
                      function(err) {
                        invoke("throw", err, resolve, reject);
                      }
                    );
                  }

                  return Promise.resolve(value).then(
                    function(unwrapped) {
                      result.value = unwrapped;
                      resolve(result);
                    },
                    function(error) {
                      return invoke("throw", error, resolve, reject);
                    }
                  );
                }
              }
