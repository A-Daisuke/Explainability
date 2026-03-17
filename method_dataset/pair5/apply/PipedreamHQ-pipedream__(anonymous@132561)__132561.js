function __method_wrapper__() {
                return declaration.parameters.map(function (parameter, parameterIndex) {
                    var types = [];
                    var isRest = ts.isRestParameter(parameter);
                    var isOptional = false;
                    for (var _i = 0, calls_1 = calls; _i < calls_1.length; _i++) {
                        var call = calls_1[_i];
                        if (call.argumentTypes.length <= parameterIndex) {
                            isOptional = ts.isInJSFile(declaration);
                            types.push(checker.getUndefinedType());
                        }
                        else if (isRest) {
                            for (var i = parameterIndex; i < call.argumentTypes.length; i++) {
                                types.push(checker.getBaseTypeOfLiteralType(call.argumentTypes[i]));
                            }
                        }
                        else {
                            types.push(checker.getBaseTypeOfLiteralType(call.argumentTypes[parameterIndex]));
                        }
                    }
                    if (ts.isIdentifier(parameter.name)) {
                        var inferred = inferTypesFromReferencesSingle(getReferences(parameter.name, program, cancellationToken));
                        types.push.apply(types, (isRest ? ts.mapDefined(inferred, checker.getElementTypeOfArrayType) : inferred));
                    }
                    var type = combineTypes(types);
                    return {
                        type: isRest ? checker.createArrayType(type) : type,
                        isOptional: isOptional && !isRest,
                        declaration: parameter
                    };
                });

}
