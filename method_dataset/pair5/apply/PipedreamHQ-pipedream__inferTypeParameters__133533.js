            function inferTypeParameters(genericType, usageType, typeParameter) {
                if (genericType === typeParameter) {
                    return [usageType];
                }
                else if (genericType.flags & 3145728 /* UnionOrIntersection */) {
                    return ts.flatMap(genericType.types, function (t) { return inferTypeParameters(t, usageType, typeParameter); });
                }
                else if (ts.getObjectFlags(genericType) & 4 /* Reference */ && ts.getObjectFlags(usageType) & 4 /* Reference */) {
                    // this is wrong because we need a reference to the targetType to, so we can check that it's also a reference
                    var genericArgs = checker.getTypeArguments(genericType);
                    var usageArgs = checker.getTypeArguments(usageType);
                    var types = [];
                    if (genericArgs && usageArgs) {
                        for (var i = 0; i < genericArgs.length; i++) {
                            if (usageArgs[i]) {
                                types.push.apply(types, inferTypeParameters(genericArgs[i], usageArgs[i], typeParameter));
                            }
                        }
                    }
                    return types;
                }
                var genericSigs = checker.getSignaturesOfType(genericType, 0 /* Call */);
                var usageSigs = checker.getSignaturesOfType(usageType, 0 /* Call */);
                if (genericSigs.length === 1 && usageSigs.length === 1) {
                    return inferFromSignatures(genericSigs[0], usageSigs[0], typeParameter);
                }
                return [];
            }
