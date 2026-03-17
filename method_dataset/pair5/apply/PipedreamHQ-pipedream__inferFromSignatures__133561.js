            function inferFromSignatures(genericSig, usageSig, typeParameter) {
                var types = [];
                for (var i = 0; i < genericSig.parameters.length; i++) {
                    var genericParam = genericSig.parameters[i];
                    var usageParam = usageSig.parameters[i];
                    var isRest = genericSig.declaration && ts.isRestParameter(genericSig.declaration.parameters[i]);
                    if (!usageParam) {
                        break;
                    }
                    var genericParamType = checker.getTypeOfSymbolAtLocation(genericParam, genericParam.valueDeclaration);
                    var elementType = isRest && checker.getElementTypeOfArrayType(genericParamType);
                    if (elementType) {
                        genericParamType = elementType;
                    }
                    var targetType = usageParam.type || checker.getTypeOfSymbolAtLocation(usageParam, usageParam.valueDeclaration);
                    types.push.apply(types, inferTypeParameters(genericParamType, targetType, typeParameter));
                }
                var genericReturn = checker.getReturnTypeOfSignature(genericSig);
                var usageReturn = checker.getReturnTypeOfSignature(usageSig);
                types.push.apply(types, inferTypeParameters(genericReturn, usageReturn, typeParameter));
                return types;
            }
