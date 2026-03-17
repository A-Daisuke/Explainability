    function mergeLexicalEnvironment(statements, declarations) {
        if (!ts.some(declarations)) {
            return statements;
        }
        // When we merge new lexical statements into an existing statement list, we merge them in the following manner:
        //
        // Given:
        //
        // | Left                               | Right                               |
        // |------------------------------------|-------------------------------------|
        // | [standard prologues (left)]        | [standard prologues (right)]        |
        // | [hoisted functions (left)]         | [hoisted functions (right)]         |
        // | [hoisted variables (left)]         | [hoisted variables (right)]         |
        // | [lexical init statements (left)]   | [lexical init statements (right)]   |
        // | [other statements (left)]          |                                     |
        //
        // The resulting statement list will be:
        //
        // | Result                              |
        // |-------------------------------------|
        // | [standard prologues (right)]        |
        // | [standard prologues (left)]         |
        // | [hoisted functions (right)]         |
        // | [hoisted functions (left)]          |
        // | [hoisted variables (right)]         |
        // | [hoisted variables (left)]          |
        // | [lexical init statements (right)]   |
        // | [lexical init statements (left)]    |
        // | [other statements (left)]           |
        //
        // NOTE: It is expected that new lexical init statements must be evaluated before existing lexical init statements,
        // as the prior transformation may depend on the evaluation of the lexical init statements to be in the correct state.
        // find standard prologues on left in the following order: standard directives, hoisted functions, hoisted variables, other custom
        var leftStandardPrologueEnd = findSpanEnd(statements, ts.isPrologueDirective, 0);
        var leftHoistedFunctionsEnd = findSpanEnd(statements, ts.isHoistedFunction, leftStandardPrologueEnd);
        var leftHoistedVariablesEnd = findSpanEnd(statements, ts.isHoistedVariableStatement, leftHoistedFunctionsEnd);
        // find standard prologues on right in the following order: standard directives, hoisted functions, hoisted variables, other custom
        var rightStandardPrologueEnd = findSpanEnd(declarations, ts.isPrologueDirective, 0);
        var rightHoistedFunctionsEnd = findSpanEnd(declarations, ts.isHoistedFunction, rightStandardPrologueEnd);
        var rightHoistedVariablesEnd = findSpanEnd(declarations, ts.isHoistedVariableStatement, rightHoistedFunctionsEnd);
        var rightCustomPrologueEnd = findSpanEnd(declarations, ts.isCustomPrologue, rightHoistedVariablesEnd);
        ts.Debug.assert(rightCustomPrologueEnd === declarations.length, "Expected declarations to be valid standard or custom prologues");
        // splice prologues from the right into the left. We do this in reverse order
        // so that we don't need to recompute the index on the left when we insert items.
        var left = ts.isNodeArray(statements) ? statements.slice() : statements;
        // splice other custom prologues from right into left
        if (rightCustomPrologueEnd > rightHoistedVariablesEnd) {
            left.splice.apply(left, __spreadArrays([leftHoistedVariablesEnd, 0], declarations.slice(rightHoistedVariablesEnd, rightCustomPrologueEnd)));
        }
        // splice hoisted variables from right into left
        if (rightHoistedVariablesEnd > rightHoistedFunctionsEnd) {
            left.splice.apply(left, __spreadArrays([leftHoistedFunctionsEnd, 0], declarations.slice(rightHoistedFunctionsEnd, rightHoistedVariablesEnd)));
        }
        // splice hoisted functions from right into left
        if (rightHoistedFunctionsEnd > rightStandardPrologueEnd) {
            left.splice.apply(left, __spreadArrays([leftStandardPrologueEnd, 0], declarations.slice(rightStandardPrologueEnd, rightHoistedFunctionsEnd)));
        }
        // splice standard prologues from right into left (that are not already in left)
        if (rightStandardPrologueEnd > 0) {
            if (leftStandardPrologueEnd === 0) {
                left.splice.apply(left, __spreadArrays([0, 0], declarations.slice(0, rightStandardPrologueEnd)));
            }
            else {
                var leftPrologues = ts.createMap();
                for (var i = 0; i < leftStandardPrologueEnd; i++) {
                    var leftPrologue = statements[i];
                    leftPrologues.set(leftPrologue.expression.text, true);
                }
                for (var i = rightStandardPrologueEnd - 1; i >= 0; i--) {
                    var rightPrologue = declarations[i];
                    if (!leftPrologues.has(rightPrologue.expression.text)) {
                        left.unshift(rightPrologue);
                    }
                }
            }
        }
        if (ts.isNodeArray(statements)) {
            return ts.setTextRange(ts.createNodeArray(left, statements.hasTrailingComma), statements);
        }
        return statements;
    }
