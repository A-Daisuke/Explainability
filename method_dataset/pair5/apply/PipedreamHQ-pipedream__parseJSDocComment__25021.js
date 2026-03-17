            function parseJSDocComment(parent, start, length) {
                var _a;
                var saveToken = currentToken;
                var saveParseDiagnosticsLength = parseDiagnostics.length;
                var saveParseErrorBeforeNextFinishedNode = parseErrorBeforeNextFinishedNode;
                var comment = doInsideOfContext(4194304 /* JSDoc */, function () { return parseJSDocCommentWorker(start, length); });
                if (comment) {
                    comment.parent = parent;
                }
                if (contextFlags & 131072 /* JavaScriptFile */) {
                    if (!sourceFile.jsDocDiagnostics) {
                        sourceFile.jsDocDiagnostics = [];
                    }
                    (_a = sourceFile.jsDocDiagnostics).push.apply(_a, parseDiagnostics);
                }
                currentToken = saveToken;
                parseDiagnostics.length = saveParseDiagnosticsLength;
                parseErrorBeforeNextFinishedNode = saveParseErrorBeforeNextFinishedNode;
                return comment;
            }
