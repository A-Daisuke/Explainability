        function transformFunctionBody(node) {
            var multiLine = false; // indicates whether the block *must* be emitted as multiple lines
            var singleLine = false; // indicates whether the block *may* be emitted as a single line
            var statementsLocation;
            var closeBraceLocation;
            var prologue = [];
            var statements = [];
            var body = node.body;
            var statementOffset;
            resumeLexicalEnvironment();
            if (ts.isBlock(body)) {
                // ensureUseStrict is false because no new prologue-directive should be added.
                // addStandardPrologue will put already-existing directives at the beginning of the target statement-array
                statementOffset = ts.addStandardPrologue(prologue, body.statements, /*ensureUseStrict*/ false);
                statementOffset = ts.addCustomPrologue(statements, body.statements, statementOffset, visitor, ts.isHoistedFunction);
                statementOffset = ts.addCustomPrologue(statements, body.statements, statementOffset, visitor, ts.isHoistedVariableStatement);
            }
            multiLine = addDefaultValueAssignmentsIfNeeded(statements, node) || multiLine;
            multiLine = addRestParameterIfNeeded(statements, node, /*inConstructorWithSynthesizedSuper*/ false) || multiLine;
            if (ts.isBlock(body)) {
                // addCustomPrologue puts already-existing directives at the beginning of the target statement-array
                statementOffset = ts.addCustomPrologue(statements, body.statements, statementOffset, visitor);
                statementsLocation = body.statements;
                ts.addRange(statements, ts.visitNodes(body.statements, visitor, ts.isStatement, statementOffset));
                // If the original body was a multi-line block, this must be a multi-line block.
                if (!multiLine && body.multiLine) {
                    multiLine = true;
                }
            }
            else {
                ts.Debug.assert(node.kind === 202 /* ArrowFunction */);
                // To align with the old emitter, we use a synthetic end position on the location
                // for the statement list we synthesize when we down-level an arrow function with
                // an expression function body. This prevents both comments and source maps from
                // being emitted for the end position only.
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
                ts.setEmitFlags(returnStatement, 384 /* NoTokenSourceMaps */ | 32 /* NoTrailingSourceMap */ | 1024 /* NoTrailingComments */);
                statements.push(returnStatement);
                // To align with the source map emit for the old emitter, we set a custom
                // source map location for the close brace.
                closeBraceLocation = body;
            }
            ts.mergeLexicalEnvironment(prologue, endLexicalEnvironment());
            insertCaptureNewTargetIfNeeded(prologue, node, /*copyOnWrite*/ false);
            insertCaptureThisForNodeIfNeeded(prologue, node);
            // If we added any final generated statements, this must be a multi-line block
            if (ts.some(prologue)) {
                multiLine = true;
            }
            statements.unshift.apply(statements, prologue);
            if (ts.isBlock(body) && ts.arrayIsEqualTo(statements, body.statements)) {
                // no changes were made, preserve the tree
                return body;
            }
            var block = ts.createBlock(ts.setTextRange(ts.createNodeArray(statements), statementsLocation), multiLine);
            ts.setTextRange(block, node.body);
            if (!multiLine && singleLine) {
                ts.setEmitFlags(block, 1 /* SingleLine */);
            }
            if (closeBraceLocation) {
                ts.setTokenSourceMapRange(block, 19 /* CloseBraceToken */, closeBraceLocation);
            }
            ts.setOriginalNode(block, node.body);
            return block;
        }
