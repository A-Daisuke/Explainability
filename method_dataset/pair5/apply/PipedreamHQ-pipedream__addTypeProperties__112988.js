            function addTypeProperties(type, insertAwait, insertQuestionDot) {
                isNewIdentifierLocation = !!type.getStringIndexType();
                if (isRightOfQuestionDot && ts.some(type.getCallSignatures())) {
                    isNewIdentifierLocation = true;
                }
                var propertyAccess = node.kind === 188 /* ImportType */ ? node : node.parent;
                if (isUncheckedFile) {
                    // In javascript files, for union types, we don't just get the members that
                    // the individual types have in common, we also include all the members that
                    // each individual type has. This is because we're going to add all identifiers
                    // anyways. So we might as well elevate the members that were at least part
                    // of the individual types to a higher status since we know what they are.
                    symbols.push.apply(symbols, getPropertiesForCompletion(type, typeChecker));
                }
                else {
                    for (var _i = 0, _a = type.getApparentProperties(); _i < _a.length; _i++) {
                        var symbol = _a[_i];
                        if (typeChecker.isValidPropertyAccessForCompletions(propertyAccess, type, symbol)) {
                            addPropertySymbol(symbol, /*insertAwait*/ false, insertQuestionDot);
                        }
                    }
                }
                if (insertAwait && preferences.includeCompletionsWithInsertText) {
                    var promiseType = typeChecker.getPromisedTypeOfPromise(type);
                    if (promiseType) {
                        for (var _b = 0, _c = promiseType.getApparentProperties(); _b < _c.length; _b++) {
                            var symbol = _c[_b];
                            if (typeChecker.isValidPropertyAccessForCompletions(propertyAccess, promiseType, symbol)) {
                                addPropertySymbol(symbol, /* insertAwait */ true, insertQuestionDot);
                            }
                        }
                    }
                }
            }
