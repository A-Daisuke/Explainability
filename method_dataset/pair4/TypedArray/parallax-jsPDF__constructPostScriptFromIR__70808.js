function __method_wrapper__() {
            constructPostScriptFromIR: function constructPostScriptFromIR(
              _ref13
            ) {
              var xref = _ref13.xref,
                isEvalSupported = _ref13.isEvalSupported,
                IR = _ref13.IR;
              var domain = IR[1];
              var range = IR[2];
              var code = IR[3];

              if (isEvalSupported && IsEvalSupportedCached.value) {
                var compiled = new PostScriptCompiler().compile(
                  code,
                  domain,
                  range
                );

                if (compiled) {
                  return new Function(
                    "src",
                    "srcOffset",
                    "dest",
                    "destOffset",
                    compiled
                  );
                }
              }

              (0, _util.info)("Unable to compile PS function");
              var numOutputs = range.length >> 1;
              var numInputs = domain.length >> 1;
              var evaluator = new PostScriptEvaluator(code);
              var cache = Object.create(null);
              var MAX_CACHE_SIZE = 2048 * 4;
              var cache_available = MAX_CACHE_SIZE;
              var tmpBuf = new Float32Array(numInputs);
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

}
