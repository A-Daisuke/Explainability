        function declareSymbol(symbolTable, parent, node, includes, excludes, isReplaceableByMethod) {
            ts.Debug.assert(!ts.hasDynamicName(node));
            var isDefaultExport = ts.hasModifier(node, 512 /* Default */) || ts.isExportSpecifier(node) && node.name.escapedText === "default";
            // The exported symbol for an export default function/class node is always named "default"
            var name = isDefaultExport && parent ? "default" /* Default */ : getDeclarationName(node);
            var symbol;
            if (name === undefined) {
                symbol = createSymbol(0 /* None */, "__missing" /* Missing */);
            }
            else {
                // Check and see if the symbol table already has a symbol with this name.  If not,
                // create a new symbol with this name and add it to the table.  Note that we don't
                // give the new symbol any flags *yet*.  This ensures that it will not conflict
                // with the 'excludes' flags we pass in.
                //
                // If we do get an existing symbol, see if it conflicts with the new symbol we're
                // creating.  For example, a 'var' symbol and a 'class' symbol will conflict within
                // the same symbol table.  If we have a conflict, report the issue on each
                // declaration we have for this symbol, and then create a new symbol for this
                // declaration.
                //
                // Note that when properties declared in Javascript constructors
                // (marked by isReplaceableByMethod) conflict with another symbol, the property loses.
                // Always. This allows the common Javascript pattern of overwriting a prototype method
                // with an bound instance method of the same type: `this.method = this.method.bind(this)`
                //
                // If we created a new symbol, either because we didn't have a symbol with this name
                // in the symbol table, or we conflicted with an existing symbol, then just add this
                // node as the sole declaration of the new symbol.
                //
                // Otherwise, we'll be merging into a compatible existing symbol (for example when
                // you have multiple 'vars' with the same name in the same container).  In this case
                // just add this node into the declarations list of the symbol.
                symbol = symbolTable.get(name);
                if (includes & 2885600 /* Classifiable */) {
                    classifiableNames.set(name, true);
                }
                if (!symbol) {
                    symbolTable.set(name, symbol = createSymbol(0 /* None */, name));
                    if (isReplaceableByMethod)
                        symbol.isReplaceableByMethod = true;
                }
                else if (isReplaceableByMethod && !symbol.isReplaceableByMethod) {
                    // A symbol already exists, so don't add this as a declaration.
                    return symbol;
                }
                else if (symbol.flags & excludes) {
                    if (symbol.isReplaceableByMethod) {
                        // Javascript constructor-declared symbols can be discarded in favor of
                        // prototype symbols like methods.
                        symbolTable.set(name, symbol = createSymbol(0 /* None */, name));
                    }
                    else if (!(includes & 3 /* Variable */ && symbol.flags & 67108864 /* Assignment */)) {
                        // Assignment declarations are allowed to merge with variables, no matter what other flags they have.
                        if (ts.isNamedDeclaration(node)) {
                            node.name.parent = node;
                        }
                        // Report errors every position with duplicate declaration
                        // Report errors on previous encountered declarations
                        var message_1 = symbol.flags & 2 /* BlockScopedVariable */
                            ? ts.Diagnostics.Cannot_redeclare_block_scoped_variable_0
                            : ts.Diagnostics.Duplicate_identifier_0;
                        var messageNeedsName_1 = true;
                        if (symbol.flags & 384 /* Enum */ || includes & 384 /* Enum */) {
                            message_1 = ts.Diagnostics.Enum_declarations_can_only_merge_with_namespace_or_other_enum_declarations;
                            messageNeedsName_1 = false;
                        }
                        var multipleDefaultExports_1 = false;
                        if (ts.length(symbol.declarations)) {
                            // If the current node is a default export of some sort, then check if
                            // there are any other default exports that we need to error on.
                            // We'll know whether we have other default exports depending on if `symbol` already has a declaration list set.
                            if (isDefaultExport) {
                                message_1 = ts.Diagnostics.A_module_cannot_have_multiple_default_exports;
                                messageNeedsName_1 = false;
                                multipleDefaultExports_1 = true;
                            }
                            else {
                                // This is to properly report an error in the case "export default { }" is after export default of class declaration or function declaration.
                                // Error on multiple export default in the following case:
                                // 1. multiple export default of class declaration or function declaration by checking NodeFlags.Default
                                // 2. multiple export default of export assignment. This one doesn't have NodeFlags.Default on (as export default doesn't considered as modifiers)
                                if (symbol.declarations && symbol.declarations.length &&
                                    (node.kind === 259 /* ExportAssignment */ && !node.isExportEquals)) {
                                    message_1 = ts.Diagnostics.A_module_cannot_have_multiple_default_exports;
                                    messageNeedsName_1 = false;
                                    multipleDefaultExports_1 = true;
                                }
                            }
                        }
                        var relatedInformation_1 = [];
                        if (ts.isTypeAliasDeclaration(node) && ts.nodeIsMissing(node.type) && ts.hasModifier(node, 1 /* Export */) && symbol.flags & (2097152 /* Alias */ | 788968 /* Type */ | 1920 /* Namespace */)) {
                            // export type T; - may have meant export type { T }?
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
                        symbol = createSymbol(0 /* None */, name);
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
