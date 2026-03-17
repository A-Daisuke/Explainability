        function getTransformationBody(func, prevArgName, argName, parent, transformer) {
            var _a, _b, _c, _d;
            switch (func.kind) {
                case 100 /* NullKeyword */:
                    // do not produce a transformed statement for a null argument
                    break;
                case 75 /* Identifier */: // identifier includes undefined
                    if (!argName) {
                        // undefined was argument passed to promise handler
                        break;
                    }
                    var synthCall = ts.createCall(ts.getSynthesizedDeepClone(func), /*typeArguments*/ undefined, isSynthIdentifier(argName) ? [argName.identifier] : []);
                    if (shouldReturn(parent, transformer)) {
                        return maybeAnnotateAndReturn(synthCall, (_a = parent.typeArguments) === null || _a === void 0 ? void 0 : _a[0]);
                    }
                    var type = transformer.checker.getTypeAtLocation(func);
                    var callSignatures = transformer.checker.getSignaturesOfType(type, 0 /* Call */);
                    if (!callSignatures.length) {
                        // if identifier in handler has no call signatures, it's invalid
                        return silentFail();
                    }
                    var returnType = callSignatures[0].getReturnType();
                    var varDeclOrAssignment = createVariableOrAssignmentOrExpressionStatement(prevArgName, ts.createAwait(synthCall), (_b = parent.typeArguments) === null || _b === void 0 ? void 0 : _b[0]);
                    if (prevArgName) {
                        prevArgName.types.push(returnType);
                    }
                    return varDeclOrAssignment;
                case 201 /* FunctionExpression */:
                case 202 /* ArrowFunction */: {
                    var funcBody = func.body;
                    // Arrow functions with block bodies { } will enter this control flow
                    if (ts.isBlock(funcBody)) {
                        var refactoredStmts = [];
                        var seenReturnStatement = false;
                        for (var _i = 0, _e = funcBody.statements; _i < _e.length; _i++) {
                            var statement = _e[_i];
                            if (ts.isReturnStatement(statement)) {
                                seenReturnStatement = true;
                                if (ts.isReturnStatementWithFixablePromiseHandler(statement)) {
                                    refactoredStmts = refactoredStmts.concat(getInnerTransformationBody(transformer, [statement], prevArgName));
                                }
                                else {
                                    refactoredStmts.push.apply(refactoredStmts, maybeAnnotateAndReturn(statement.expression, (_c = parent.typeArguments) === null || _c === void 0 ? void 0 : _c[0]));
                                }
                            }
                            else {
                                refactoredStmts.push(statement);
                            }
                        }
                        return shouldReturn(parent, transformer)
                            ? refactoredStmts.map(function (s) { return ts.getSynthesizedDeepClone(s); })
                            : removeReturns(refactoredStmts, prevArgName, transformer, seenReturnStatement);
                    }
                    else {
                        var innerRetStmts = ts.isFixablePromiseHandler(funcBody) ? [ts.createReturn(funcBody)] : ts.emptyArray;
                        var innerCbBody = getInnerTransformationBody(transformer, innerRetStmts, prevArgName);
                        if (innerCbBody.length > 0) {
                            return innerCbBody;
                        }
                        var type_1 = transformer.checker.getTypeAtLocation(func);
                        var returnType_1 = getLastCallSignature(type_1, transformer.checker).getReturnType();
                        var rightHandSide = ts.getSynthesizedDeepClone(funcBody);
                        var possiblyAwaitedRightHandSide = !!transformer.checker.getPromisedTypeOfPromise(returnType_1) ? ts.createAwait(rightHandSide) : rightHandSide;
                        if (!shouldReturn(parent, transformer)) {
                            var transformedStatement = createVariableOrAssignmentOrExpressionStatement(prevArgName, possiblyAwaitedRightHandSide, /*typeAnnotation*/ undefined);
                            if (prevArgName) {
                                prevArgName.types.push(returnType_1);
                            }
                            return transformedStatement;
                        }
                        else {
                            return maybeAnnotateAndReturn(possiblyAwaitedRightHandSide, (_d = parent.typeArguments) === null || _d === void 0 ? void 0 : _d[0]);
                        }
                    }
                }
                default:
                    // If no cases apply, we've found a transformation body we don't know how to handle, so the refactoring should no-op to avoid deleting code.
                    return silentFail();
            }
            return ts.emptyArray;
        }
