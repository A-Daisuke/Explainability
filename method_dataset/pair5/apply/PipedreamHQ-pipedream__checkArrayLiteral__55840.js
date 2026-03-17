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
                var spread = e.kind === 213 /* SpreadElement */ && e.expression;
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
                        // Given the following situation:
                        //    var c: {};
                        //    [...c] = ["", 0];
                        //
                        // c is represented in the tree as a spread element in an array literal.
                        // But c really functions as a rest element, and its purpose is to provide
                        // a contextual type for the right hand side of the assignment. Therefore,
                        // instead of calling checkExpression on "...c", which will give an error
                        // if c is not iterable/array-like, we need to act as if we are trying to
                        // get the contextual element type from it. So we do something similar to
                        // getContextualTypeForElementExpression, which will crucially not error
                        // if there is no index type / iterated type.
                        var restElementType = getIndexTypeOfType(spreadType, 1 /* Number */) ||
                            getIteratedTypeOrElementType(65 /* Destructuring */, spreadType, undefinedType, /*errorNode*/ undefined, /*checkAssignability*/ false);
                        if (restElementType) {
                            elementTypes.push(restElementType);
                        }
                    }
                    else {
                        var elementContextualType = getContextualTypeForElementExpression(contextualType, elementTypes.length);
                        var type = checkExpressionForMutableLocation(e, checkMode, elementContextualType, forceTuple);
                        elementTypes.push(type);
                    }
                    if (spread) { // tuples are done above, so these are only arrays
                        if (i === elementCount - 1)
                            hasEndingSpreadElement = true;
                        else
                            hasNonEndingSpreadElement = true;
                    }
                }
            }
            if (!hasNonEndingSpreadElement) {
                var minLength = elementTypes.length - (hasEndingSpreadElement ? 1 : 0);
                // If array literal is actually a destructuring pattern, mark it as an implied type. We do this such
                // that we get the same behavior for "var [x, y] = []" and "[x, y] = []".
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
                getUnionType(elementTypes, 2 /* Subtype */) :
                strictNullChecks ? implicitNeverType : undefinedWideningType, inConstContext));
        }
