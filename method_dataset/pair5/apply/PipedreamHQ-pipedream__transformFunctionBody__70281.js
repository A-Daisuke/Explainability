        function transformFunctionBody(node) {
            var multiLine = false;
            var singleLine = false;
            var statementsLocation;
            var closeBraceLocation;
            var prologue = [];
            var statements = [];
            var body = node.body;
            var statementOffset;
            resumeLexicalEnvironment();
            if (ts.isBlock(body)) {
                statementOffset = ts.addStandardPrologue(prologue, body.statements, false);
                statementOffset = ts.addCustomPrologue(statements, body.statements, statementOffset, visitor, ts.isHoistedFunction);
                statementOffset = ts.addCustomPrologue(statements, body.statements, statementOffset, visitor, ts.isHoistedVariableStatement);
            }
            multiLine = addDefaultValueAssignmentsIfNeeded(statements, node) || multiLine;
            multiLine = addRestParameterIfNeeded(statements, node, false) || multiLine;
            if (ts.isBlock(body)) {
                statementOffset = ts.addCustomPrologue(statements, body.statements, statementOffset, visitor);
                statementsLocation = body.statements;
                ts.addRange(statements, ts.visitNodes(body.statements, visitor, ts.isStatement, statementOffset));
                if (!multiLine && body.multiLine) {
                    multiLine = true;
                }
            }
            else {
                ts.Debug.assert(node.kind === 202);
                statementsLocation = ts.moveRangeEnd(body, -1);
                var equalsGreaterThanToken = node.equalsGreaterThanToken;
                if (!ts.nodeIsSynthesized(equalsGreaterThanToken) && !ts.nodeIsSynthesized(body)) {
                    if (ts.rangeEndIsOnSameLineAsRangeStart(equalsGreaterThanToken, body, currentSourceFile)) {
                        singleLine = true;
                    }
                    else {
                        multiLine = true;
                    }
                }
                var expression = ts.visitNode(body, visitor, ts.isExpression);
                var returnStatement = ts.createReturn(expression);
                ts.setTextRange(returnStatement, body);
                ts.moveSyntheticComments(returnStatement, body);
                ts.setEmitFlags(returnStatement, 384 | 32 | 1024);
                statements.push(returnStatement);
                closeBraceLocation = body;
            }
            ts.mergeLexicalEnvironment(prologue, endLexicalEnvironment());
            insertCaptureNewTargetIfNeeded(prologue, node, false);
            insertCaptureThisForNodeIfNeeded(prologue, node);
            if (ts.some(prologue)) {
                multiLine = true;
            }
            statements.unshift.apply(statements, prologue);
            if (ts.isBlock(body) && ts.arrayIsEqualTo(statements, body.statements)) {
                return body;
            }
            var block = ts.createBlock(ts.setTextRange(ts.createNodeArray(statements), statementsLocation), multiLine);
            ts.setTextRange(block, node.body);
            if (!multiLine && singleLine) {
                ts.setEmitFlags(block, 1);
            }
            if (closeBraceLocation) {
                ts.setTokenSourceMapRange(block, 19, closeBraceLocation);
            }
            ts.setOriginalNode(block, node.body);
            return block;
        }
