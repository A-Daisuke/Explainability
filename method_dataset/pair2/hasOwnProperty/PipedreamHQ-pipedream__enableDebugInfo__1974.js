        function enableDebugInfo() {
            if (isDebugInfoEnabled)
                return;
            Object.defineProperties(ts.objectAllocator.getSymbolConstructor().prototype, {
                __debugFlags: { get: function () { return formatSymbolFlags(this.flags); } }
            });
            Object.defineProperties(ts.objectAllocator.getTypeConstructor().prototype, {
                __debugFlags: { get: function () { return formatTypeFlags(this.flags); } },
                __debugObjectFlags: { get: function () { return this.flags & 524288 ? formatObjectFlags(this.objectFlags) : ""; } },
                __debugTypeToString: { value: function () { return this.checker.typeToString(this); } },
            });
            var nodeConstructors = [
                ts.objectAllocator.getNodeConstructor(),
                ts.objectAllocator.getIdentifierConstructor(),
                ts.objectAllocator.getTokenConstructor(),
                ts.objectAllocator.getSourceFileConstructor()
            ];
            for (var _i = 0, nodeConstructors_1 = nodeConstructors; _i < nodeConstructors_1.length; _i++) {
                var ctor = nodeConstructors_1[_i];
                if (!ctor.prototype.hasOwnProperty("__debugKind")) {
                    Object.defineProperties(ctor.prototype, {
                        __debugKind: { get: function () { return formatSyntaxKind(this.kind); } },
                        __debugNodeFlags: { get: function () { return formatNodeFlags(this.flags); } },
                        __debugModifierFlags: { get: function () { return formatModifierFlags(ts.getModifierFlagsNoCache(this)); } },
                        __debugTransformFlags: { get: function () { return formatTransformFlags(this.transformFlags); } },
                        __debugIsParseTreeNode: { get: function () { return ts.isParseTreeNode(this); } },
                        __debugEmitFlags: { get: function () { return formatEmitFlags(ts.getEmitFlags(this)); } },
                        __debugGetText: {
                            value: function (includeTrivia) {
                                if (ts.nodeIsSynthesized(this))
                                    return "";
                                var parseNode = ts.getParseTreeNode(this);
                                var sourceFile = parseNode && ts.getSourceFileOfNode(parseNode);
                                return sourceFile ? ts.getSourceTextOfNodeFromSourceFile(sourceFile, parseNode, includeTrivia) : "";
                            }
                        }
                    });
                }
            }
            try {
                if (ts.sys && ts.sys.require) {
                    var basePath = ts.getDirectoryPath(ts.resolvePath(ts.sys.getExecutingFilePath()));
                    var result = ts.sys.require(basePath, "./compiler-debug");
                    if (!result.error) {
                        result.module.init(ts);
                        extendedDebugModule = result.module;
                    }
                }
            }
            catch (_a) {
            }
            isDebugInfoEnabled = true;
        }
