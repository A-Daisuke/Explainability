    function mergeLexicalEnvironment(statements, declarations) {
        if (!ts.some(declarations)) {
            return statements;
        }
        var leftStandardPrologueEnd = findSpanEnd(statements, ts.isPrologueDirective, 0);
        var leftHoistedFunctionsEnd = findSpanEnd(statements, ts.isHoistedFunction, leftStandardPrologueEnd);
        var leftHoistedVariablesEnd = findSpanEnd(statements, ts.isHoistedVariableStatement, leftHoistedFunctionsEnd);
        var rightStandardPrologueEnd = findSpanEnd(declarations, ts.isPrologueDirective, 0);
        var rightHoistedFunctionsEnd = findSpanEnd(declarations, ts.isHoistedFunction, rightStandardPrologueEnd);
        var rightHoistedVariablesEnd = findSpanEnd(declarations, ts.isHoistedVariableStatement, rightHoistedFunctionsEnd);
        var rightCustomPrologueEnd = findSpanEnd(declarations, ts.isCustomPrologue, rightHoistedVariablesEnd);
        ts.Debug.assert(rightCustomPrologueEnd === declarations.length, "Expected declarations to be valid standard or custom prologues");
        var left = ts.isNodeArray(statements) ? statements.slice() : statements;
        if (rightCustomPrologueEnd > rightHoistedVariablesEnd) {
            left.splice.apply(left, __spreadArrays([leftHoistedVariablesEnd, 0], declarations.slice(rightHoistedVariablesEnd, rightCustomPrologueEnd)));
        }
        if (rightHoistedVariablesEnd > rightHoistedFunctionsEnd) {
            left.splice.apply(left, __spreadArrays([leftHoistedFunctionsEnd, 0], declarations.slice(rightHoistedFunctionsEnd, rightHoistedVariablesEnd)));
        }
        if (rightHoistedFunctionsEnd > rightStandardPrologueEnd) {
            left.splice.apply(left, __spreadArrays([leftStandardPrologueEnd, 0], declarations.slice(rightStandardPrologueEnd, rightHoistedFunctionsEnd)));
        }
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
