function __method_wrapper__() {
              return function constructPostScriptFromIRResult(
                src,
                srcOffset,
                dest,
                destOffset
              ) {
                var i, value;
                var key = "";
                var input = tmpBuf;

                for (i = 0; i < numInputs; i++) {
                  value = src[srcOffset + i];
                  input[i] = value;
                  key += value + "_";
                }

                var cachedValue = cache[key];

                if (cachedValue !== undefined) {
                  dest.set(cachedValue, destOffset);
                  return;
                }

                var output = new Float32Array(numOutputs);
                var stack = evaluator.execute(input);
                var stackIndex = stack.length - numOutputs;

                for (i = 0; i < numOutputs; i++) {
                  value = stack[stackIndex + i];
                  var bound = range[i * 2];

                  if (value < bound) {
                    value = bound;
                  } else {
                    bound = range[i * 2 + 1];

                    if (value > bound) {
                      value = bound;
                    }
                  }

                  output[i] = value;
                }

                if (cache_available > 0) {
                  cache_available--;
                  cache[key] = output;
                }

                dest.set(output, destOffset);
              };

}
