        function checkArrayLiteral(node, checkMode, forceTuple) {
            var elements = node.elements;
            var elementCount = elements.length;
            var elementTypes = [];
            var hasEndingSpreadElement = false;
            var hasNonEndingSpreadElement = false;
            var contextualType = getApparentTypeOfContextualType(node);
            var inDestructuringPattern = ts.isAssignmentTarget(node);
            var inConstContext = isConstContext(node);
            for (var i = 0; i < elementCount; i++) {
                var e = elements[i];
                var spread = e.kind === 213 && e.expression;
                var spreadType = spread && checkExpression(spread, checkMode, forceTuple);
                if (spreadType && isTupleType(spreadType)) {
                    elementTypes.push.apply(elementTypes, getTypeArguments(spreadType));
                    if (spreadType.target.hasRestElement) {
                        if (i === elementCount - 1)
                            hasEndingSpreadElement = true;
                        else
                            hasNonEndingSpreadElement = true;
                    }
                }
                else {
                    if (inDestructuringPattern && spreadType) {
                        var restElementType = getIndexTypeOfType(spreadType, 1) ||
                            getIteratedTypeOrElementType(65, spreadType, undefinedType, undefined, false);
                        if (restElementType) {
                            elementTypes.push(restElementType);
                        }
                    }
                    else {
                        var elementContextualType = getContextualTypeForElementExpression(contextualType, elementTypes.length);
                        var type = checkExpressionForMutableLocation(e, checkMode, elementContextualType, forceTuple);
                        elementTypes.push(type);
                    }
                    if (spread) {
                        if (i === elementCount - 1)
                            hasEndingSpreadElement = true;
                        else
                            hasNonEndingSpreadElement = true;
                    }
                }
            }
            if (!hasNonEndingSpreadElement) {
                var minLength = elementTypes.length - (hasEndingSpreadElement ? 1 : 0);
                var tupleResult = void 0;
                if (inDestructuringPattern && minLength > 0) {
                    var type = cloneTypeReference(createTupleType(elementTypes, minLength, hasEndingSpreadElement));
                    type.pattern = node;
                    return type;
                }
                else if (tupleResult = getArrayLiteralTupleTypeIfApplicable(elementTypes, contextualType, hasEndingSpreadElement, elementTypes.length, inConstContext)) {
                    return createArrayLiteralType(tupleResult);
                }
                else if (forceTuple) {
                    return createArrayLiteralType(createTupleType(elementTypes, minLength, hasEndingSpreadElement));
                }
            }
            return createArrayLiteralType(createArrayType(elementTypes.length ?
                getUnionType(elementTypes, 2) :
                strictNullChecks ? implicitNeverType : undefinedWideningType, inConstContext));
        }
