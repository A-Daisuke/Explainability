function __method_wrapper__() {
              exports.PromiseInvokeOrPerformFallback = function(
                O,
                P,
                args,
                F,
                argsF
              ) {
                assert(O !== undefined);
                assert(IsPropertyKey(P));
                assert(Array.isArray(args));
                assert(Array.isArray(argsF));
                var method = void 0;

                try {
                  method = O[P];
                } catch (methodE) {
                  return Promise.reject(methodE);
                }

                if (method === undefined) {
                  return F.apply(null, argsF);
                }

                try {
                  return Promise.resolve(Call(method, O, args));
                } catch (e) {
                  return Promise.reject(e);
                }
              };

}
