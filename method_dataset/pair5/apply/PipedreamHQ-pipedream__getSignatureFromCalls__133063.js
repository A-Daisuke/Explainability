            function getSignatureFromCalls(calls) {
                var parameters = [];
                var length = Math.max.apply(Math, calls.map(function (c) { return c.argumentTypes.length; }));
                var _loop_14 = function (i) {
                    var symbol = checker.createSymbol(1 /* FunctionScopedVariable */, ts.escapeLeadingUnderscores("arg" + i));
                    symbol.type = combineTypes(calls.map(function (call) { return call.argumentTypes[i] || checker.getUndefinedType(); }));
                    if (calls.some(function (call) { return call.argumentTypes[i] === undefined; })) {
                        symbol.flags |= 16777216 /* Optional */;
                    }
                    parameters.push(symbol);
                };
                for (var i = 0; i < length; i++) {
                    _loop_14(i);
                }
                var returnType = combineFromUsage(combineUsages(calls.map(function (call) { return call.return_; })));
                // TODO: GH#18217
                return checker.createSignature(/*declaration*/ undefined, /*typeParameters*/ undefined, /*thisParameter*/ undefined, parameters, returnType, /*typePredicate*/ undefined, length, 0 /* None */);
            }
