function __method_wrapper__() {
              stringify: function stringify(it) {
                var args = [it];
                var i = 1;
                var replacer, $replacer;

                while (arguments.length > i) {
                  args.push(arguments[i++]);
                }

                $replacer = replacer = args[1];
                if ((!isObject(replacer) && it === undefined) || isSymbol(it))
                  return;
                if (!isArray(replacer))
                  replacer = function replacer(key, value) {
                    if (typeof $replacer == "function")
                      value = $replacer.call(this, key, value);
                    if (!isSymbol(value)) return value;
                  };
                args[1] = replacer;
                return _stringify.apply($JSON, args);
              }

}
