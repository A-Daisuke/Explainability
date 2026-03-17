                function visitExistingNodeTreeSymbols(node) {
                    var _a, _b;
                    if (ts.isJSDocAllType(node) || node.kind === 302) {
                        return ts.createKeywordTypeNode(125);
                    }
                    if (ts.isJSDocUnknownType(node)) {
                        return ts.createKeywordTypeNode(148);
                    }
                    if (ts.isJSDocNullableType(node)) {
                        return ts.createUnionTypeNode([ts.visitNode(node.type, visitExistingNodeTreeSymbols), ts.createKeywordTypeNode(100)]);
                    }
                    if (ts.isJSDocOptionalType(node)) {
                        return ts.createUnionTypeNode([ts.visitNode(node.type, visitExistingNodeTreeSymbols), ts.createKeywordTypeNode(146)]);
                    }
                    if (ts.isJSDocNonNullableType(node)) {
                        return ts.visitNode(node.type, visitExistingNodeTreeSymbols);
                    }
                    if (ts.isJSDocVariadicType(node)) {
                        return ts.createArrayTypeNode(ts.visitNode(node.type, visitExistingNodeTreeSymbols));
                    }
                    if (ts.isJSDocTypeLiteral(node)) {
                        return ts.createTypeLiteralNode(ts.map(node.jsDocPropertyTags, function (t) {
                            var name = ts.isIdentifier(t.name) ? t.name : t.name.right;
                            var typeViaParent = getTypeOfPropertyOfType(getTypeFromTypeNode(node), name.escapedText);
                            var overrideTypeNode = typeViaParent && t.typeExpression && getTypeFromTypeNode(t.typeExpression.type) !== typeViaParent ? typeToTypeNodeHelper(typeViaParent, context) : undefined;
                            return ts.createPropertySignature(undefined, name, t.typeExpression && ts.isJSDocOptionalType(t.typeExpression.type) ? ts.createToken(57) : undefined, overrideTypeNode || (t.typeExpression && ts.visitNode(t.typeExpression.type, visitExistingNodeTreeSymbols)) || ts.createKeywordTypeNode(125), undefined);
                        }));
                    }
                    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && node.typeName.escapedText === "") {
                        return ts.setOriginalNode(ts.createKeywordTypeNode(125), node);
                    }
                    if ((ts.isExpressionWithTypeArguments(node) || ts.isTypeReferenceNode(node)) && ts.isJSDocIndexSignature(node)) {
                        return ts.createTypeLiteralNode([ts.createIndexSignature(undefined, undefined, [ts.createParameter(undefined, undefined, undefined, "x", undefined, ts.visitNode(node.typeArguments[0], visitExistingNodeTreeSymbols))], ts.visitNode(node.typeArguments[1], visitExistingNodeTreeSymbols))]);
                    }
                    if (ts.isJSDocFunctionType(node)) {
                        if (ts.isJSDocConstructSignature(node)) {
                            var newTypeNode_1;
                            return ts.createConstructorTypeNode(ts.visitNodes(node.typeParameters, visitExistingNodeTreeSymbols), ts.mapDefined(node.parameters, function (p, i) { return p.name && ts.isIdentifier(p.name) && p.name.escapedText === "new" ? (newTypeNode_1 = p.type, undefined) : ts.createParameter(undefined, undefined, getEffectiveDotDotDotForParameter(p), p.name || getEffectiveDotDotDotForParameter(p) ? "args" : "arg" + i, p.questionToken, ts.visitNode(p.type, visitExistingNodeTreeSymbols), undefined); }), ts.visitNode(newTypeNode_1 || node.type, visitExistingNodeTreeSymbols));
                        }
                        else {
                            return ts.createFunctionTypeNode(ts.visitNodes(node.typeParameters, visitExistingNodeTreeSymbols), ts.map(node.parameters, function (p, i) { return ts.createParameter(undefined, undefined, getEffectiveDotDotDotForParameter(p), p.name || getEffectiveDotDotDotForParameter(p) ? "args" : "arg" + i, p.questionToken, ts.visitNode(p.type, visitExistingNodeTreeSymbols), undefined); }), ts.visitNode(node.type, visitExistingNodeTreeSymbols));
                        }
                    }
                    if (ts.isTypeReferenceNode(node) && ts.isInJSDoc(node) && (getIntendedTypeFromJSDocTypeReference(node) || unknownSymbol === resolveTypeReferenceName(getTypeReferenceName(node), 788968, true))) {
                        return ts.setOriginalNode(typeToTypeNodeHelper(getTypeFromTypeNode(node), context), node);
                    }
                    if (ts.isLiteralImportTypeNode(node)) {
                        return ts.updateImportTypeNode(node, ts.updateLiteralTypeNode(node.argument, rewriteModuleSpecifier(node, node.argument.literal)), node.qualifier, ts.visitNodes(node.typeArguments, visitExistingNodeTreeSymbols, ts.isTypeNode), node.isTypeOf);
                    }
                    if (ts.isEntityName(node) || ts.isEntityNameExpression(node)) {
                        var leftmost = ts.getFirstIdentifier(node);
                        if (ts.isInJSFile(node) && (ts.isExportsIdentifier(leftmost) || ts.isModuleExportsAccessExpression(leftmost.parent) || (ts.isQualifiedName(leftmost.parent) && ts.isModuleIdentifier(leftmost.parent.left) && ts.isExportsIdentifier(leftmost.parent.right)))) {
                            hadError = true;
                            return node;
                        }
                        var sym = resolveEntityName(leftmost, 67108863, true, true);
                        if (sym) {
                            if (isSymbolAccessible(sym, context.enclosingDeclaration, 67108863, false).accessibility !== 0) {
                                hadError = true;
                            }
                            else {
                                (_b = (_a = context.tracker) === null || _a === void 0 ? void 0 : _a.trackSymbol) === null || _b === void 0 ? void 0 : _b.call(_a, sym, context.enclosingDeclaration, 67108863);
                                includePrivateSymbol === null || includePrivateSymbol === void 0 ? void 0 : includePrivateSymbol(sym);
                            }
                            if (ts.isIdentifier(node)) {
                                var name = sym.flags & 262144 ? typeParameterToName(getDeclaredTypeOfSymbol(sym), context) : ts.getMutableClone(node);
                                name.symbol = sym;
                                return ts.setEmitFlags(ts.setOriginalNode(name, node), 16777216);
                            }
                        }
                    }
                    return ts.visitEachChild(node, visitExistingNodeTreeSymbols, ts.nullTransformationContext);
                    function getEffectiveDotDotDotForParameter(p) {
                        return p.dotDotDotToken || (p.type && ts.isJSDocVariadicType(p.type) ? ts.createToken(25) : undefined);
                    }
                    function rewriteModuleSpecifier(parent, lit) {
                        if (bundled) {
                            if (context.tracker && context.tracker.moduleResolverHost) {
                                var targetFile = getExternalModuleFileFromDeclaration(parent);
                                if (targetFile) {
                                    var getCanonicalFileName = ts.createGetCanonicalFileName(!!host.useCaseSensitiveFileNames);
                                    var resolverHost = {
                                        getCanonicalFileName: getCanonicalFileName,
                                        getCurrentDirectory: function () { return context.tracker.moduleResolverHost.getCurrentDirectory(); },
                                        getCommonSourceDirectory: function () { return context.tracker.moduleResolverHost.getCommonSourceDirectory(); }
                                    };
                                    var newName = ts.getResolvedExternalModuleName(resolverHost, targetFile);
                                    return ts.createLiteral(newName);
                                }
                            }
                        }
                        else {
                            if (context.tracker && context.tracker.trackExternalModuleSymbolOfImportTypeNode) {
                                var moduleSym = resolveExternalModuleNameWorker(lit, lit, undefined);
                                if (moduleSym) {
                                    context.tracker.trackExternalModuleSymbolOfImportTypeNode(moduleSym);
                                }
                            }
                        }
                        return lit;
                    }
                }
