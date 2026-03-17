        function declareSymbol(symbolTable, parent, node, includes, excludes, isReplaceableByMethod) {
            ts.Debug.assert(!ts.hasDynamicName(node));
            var isDefaultExport = ts.hasModifier(node, 512) || ts.isExportSpecifier(node) && node.name.escapedText === "default";
            var name = isDefaultExport && parent ? "default" : getDeclarationName(node);
            var symbol;
            if (name === undefined) {
                symbol = createSymbol(0, "__missing");
            }
            else {
                symbol = symbolTable.get(name);
                if (includes & 2885600) {
                    classifiableNames.set(name, true);
                }
                if (!symbol) {
                    symbolTable.set(name, symbol = createSymbol(0, name));
                    if (isReplaceableByMethod)
                        symbol.isReplaceableByMethod = true;
                }
                else if (isReplaceableByMethod && !symbol.isReplaceableByMethod) {
                    return symbol;
                }
                else if (symbol.flags & excludes) {
                    if (symbol.isReplaceableByMethod) {
                        symbolTable.set(name, symbol = createSymbol(0, name));
                    }
                    else if (!(includes & 3 && symbol.flags & 67108864)) {
                        if (ts.isNamedDeclaration(node)) {
                            node.name.parent = node;
                        }
                        var message_1 = symbol.flags & 2
                            ? ts.Diagnostics.Cannot_redeclare_block_scoped_variable_0
                            : ts.Diagnostics.Duplicate_identifier_0;
                        var messageNeedsName_1 = true;
                        if (symbol.flags & 384 || includes & 384) {
                            message_1 = ts.Diagnostics.Enum_declarations_can_only_merge_with_namespace_or_other_enum_declarations;
                            messageNeedsName_1 = false;
                        }
                        var multipleDefaultExports_1 = false;
                        if (ts.length(symbol.declarations)) {
                            if (isDefaultExport) {
                                message_1 = ts.Diagnostics.A_module_cannot_have_multiple_default_exports;
                                messageNeedsName_1 = false;
                                multipleDefaultExports_1 = true;
                            }
                            else {
                                if (symbol.declarations && symbol.declarations.length &&
                                    (node.kind === 259 && !node.isExportEquals)) {
                                    message_1 = ts.Diagnostics.A_module_cannot_have_multiple_default_exports;
                                    messageNeedsName_1 = false;
                                    multipleDefaultExports_1 = true;
                                }
                            }
                        }
                        var relatedInformation_1 = [];
                        if (ts.isTypeAliasDeclaration(node) && ts.nodeIsMissing(node.type) && ts.hasModifier(node, 1) && symbol.flags & (2097152 | 788968 | 1920)) {
                            relatedInformation_1.push(createDiagnosticForNode(node, ts.Diagnostics.Did_you_mean_0, "export type { " + ts.unescapeLeadingUnderscores(node.name.escapedText) + " }"));
                        }
                        var declarationName_1 = ts.getNameOfDeclaration(node) || node;
                        ts.forEach(symbol.declarations, function (declaration, index) {
                            var decl = ts.getNameOfDeclaration(declaration) || declaration;
                            var diag = createDiagnosticForNode(decl, message_1, messageNeedsName_1 ? getDisplayName(declaration) : undefined);
                            file.bindDiagnostics.push(multipleDefaultExports_1 ? ts.addRelatedInfo(diag, createDiagnosticForNode(declarationName_1, index === 0 ? ts.Diagnostics.Another_export_default_is_here : ts.Diagnostics.and_here)) : diag);
                            if (multipleDefaultExports_1) {
                                relatedInformation_1.push(createDiagnosticForNode(decl, ts.Diagnostics.The_first_export_default_is_here));
                            }
                        });
                        var diag = createDiagnosticForNode(declarationName_1, message_1, messageNeedsName_1 ? getDisplayName(node) : undefined);
                        file.bindDiagnostics.push(ts.addRelatedInfo.apply(void 0, __spreadArrays([diag], relatedInformation_1)));
                        symbol = createSymbol(0, name);
                    }
                }
            }
            addDeclarationToSymbol(symbol, node, includes);
            if (symbol.parent) {
                ts.Debug.assert(symbol.parent === parent, "Existing symbol parent should match new one");
            }
            else {
                symbol.parent = parent;
            }
            return symbol;
        }
