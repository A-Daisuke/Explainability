        function getSymbolDisplayPartsDocumentationAndSymbolKind(typeChecker, symbol, sourceFile, enclosingDeclaration, location, semanticMeaning, alias) {
            if (semanticMeaning === void 0) { semanticMeaning = ts.getMeaningFromLocation(location); }
            var displayParts = [];
            var documentation = [];
            var tags = [];
            var symbolFlags = ts.getCombinedLocalAndExportSymbolFlags(symbol);
            var symbolKind = semanticMeaning & 1 /* Value */ ? getSymbolKindOfConstructorPropertyMethodAccessorFunctionOrVar(typeChecker, symbol, location) : "" /* unknown */;
            var hasAddedSymbolInfo = false;
            var isThisExpression = location.kind === 104 /* ThisKeyword */ && ts.isInExpressionContext(location);
            var type;
            var printer;
            var documentationFromAlias;
            var tagsFromAlias;
            var hasMultipleSignatures = false;
            if (location.kind === 104 /* ThisKeyword */ && !isThisExpression) {
                return { displayParts: [ts.keywordPart(104 /* ThisKeyword */)], documentation: [], symbolKind: "primitive type" /* primitiveType */, tags: undefined };
            }
            // Class at constructor site need to be shown as constructor apart from property,method, vars
            if (symbolKind !== "" /* unknown */ || symbolFlags & 32 /* Class */ || symbolFlags & 2097152 /* Alias */) {
                // If it is accessor they are allowed only if location is at name of the accessor
                if (symbolKind === "getter" /* memberGetAccessorElement */ || symbolKind === "setter" /* memberSetAccessorElement */) {
                    symbolKind = "property" /* memberVariableElement */;
                }
                var signature = void 0;
                type = isThisExpression ? typeChecker.getTypeAtLocation(location) : typeChecker.getTypeOfSymbolAtLocation(symbol.exportSymbol || symbol, location);
                if (location.parent && location.parent.kind === 194 /* PropertyAccessExpression */) {
                    var right = location.parent.name;
                    // Either the location is on the right of a property access, or on the left and the right is missing
                    if (right === location || (right && right.getFullWidth() === 0)) {
                        location = location.parent;
                    }
                }
                // try get the call/construct signature from the type if it matches
                var callExpressionLike = void 0;
                if (ts.isCallOrNewExpression(location)) {
                    callExpressionLike = location;
                }
                else if (ts.isCallExpressionTarget(location) || ts.isNewExpressionTarget(location)) {
                    callExpressionLike = location.parent;
                }
                else if (location.parent && ts.isJsxOpeningLikeElement(location.parent) && ts.isFunctionLike(symbol.valueDeclaration)) {
                    callExpressionLike = location.parent;
                }
                if (callExpressionLike) {
                    signature = typeChecker.getResolvedSignature(callExpressionLike); // TODO: GH#18217
                    var useConstructSignatures = callExpressionLike.kind === 197 /* NewExpression */ || (ts.isCallExpression(callExpressionLike) && callExpressionLike.expression.kind === 102 /* SuperKeyword */);
                    var allSignatures = useConstructSignatures ? type.getConstructSignatures() : type.getCallSignatures();
                    if (!ts.contains(allSignatures, signature.target) && !ts.contains(allSignatures, signature)) {
                        // Get the first signature if there is one -- allSignatures may contain
                        // either the original signature or its target, so check for either
                        signature = allSignatures.length ? allSignatures[0] : undefined;
                    }
                    if (signature) {
                        if (useConstructSignatures && (symbolFlags & 32 /* Class */)) {
                            // Constructor
                            symbolKind = "constructor" /* constructorImplementationElement */;
                            addPrefixForAnyFunctionOrVar(type.symbol, symbolKind);
                        }
                        else if (symbolFlags & 2097152 /* Alias */) {
                            symbolKind = "alias" /* alias */;
                            pushSymbolKind(symbolKind);
                            displayParts.push(ts.spacePart());
                            if (useConstructSignatures) {
                                displayParts.push(ts.keywordPart(99 /* NewKeyword */));
                                displayParts.push(ts.spacePart());
                            }
                            addFullSymbolName(symbol);
                        }
                        else {
                            addPrefixForAnyFunctionOrVar(symbol, symbolKind);
                        }
                        switch (symbolKind) {
                            case "JSX attribute" /* jsxAttribute */:
                            case "property" /* memberVariableElement */:
                            case "var" /* variableElement */:
                            case "const" /* constElement */:
                            case "let" /* letElement */:
                            case "parameter" /* parameterElement */:
                            case "local var" /* localVariableElement */:
                                // If it is call or construct signature of lambda's write type name
                                displayParts.push(ts.punctuationPart(58 /* ColonToken */));
                                displayParts.push(ts.spacePart());
                                if (!(ts.getObjectFlags(type) & 16 /* Anonymous */) && type.symbol) {
                                    ts.addRange(displayParts, ts.symbolToDisplayParts(typeChecker, type.symbol, enclosingDeclaration, /*meaning*/ undefined, 4 /* AllowAnyNodeKind */ | 1 /* WriteTypeParametersOrArguments */));
                                    displayParts.push(ts.lineBreakPart());
                                }
                                if (useConstructSignatures) {
                                    displayParts.push(ts.keywordPart(99 /* NewKeyword */));
                                    displayParts.push(ts.spacePart());
                                }
                                addSignatureDisplayParts(signature, allSignatures, 262144 /* WriteArrowStyleSignature */);
                                break;
                            default:
                                // Just signature
                                addSignatureDisplayParts(signature, allSignatures);
                        }
                        hasAddedSymbolInfo = true;
                        hasMultipleSignatures = allSignatures.length > 1;
                    }
                }
                else if ((ts.isNameOfFunctionDeclaration(location) && !(symbolFlags & 98304 /* Accessor */)) || // name of function declaration
                    (location.kind === 129 /* ConstructorKeyword */ && location.parent.kind === 162 /* Constructor */)) { // At constructor keyword of constructor declaration
                    // get the signature from the declaration and write it
                    var functionDeclaration_1 = location.parent;
                    // Use function declaration to write the signatures only if the symbol corresponding to this declaration
                    var locationIsSymbolDeclaration = symbol.declarations && ts.find(symbol.declarations, function (declaration) {
                        return declaration === (location.kind === 129 /* ConstructorKeyword */ ? functionDeclaration_1.parent : functionDeclaration_1);
                    });
                    if (locationIsSymbolDeclaration) {
                        var allSignatures = functionDeclaration_1.kind === 162 /* Constructor */ ? type.getNonNullableType().getConstructSignatures() : type.getNonNullableType().getCallSignatures();
                        if (!typeChecker.isImplementationOfOverload(functionDeclaration_1)) {
                            signature = typeChecker.getSignatureFromDeclaration(functionDeclaration_1); // TODO: GH#18217
                        }
                        else {
                            signature = allSignatures[0];
                        }
                        if (functionDeclaration_1.kind === 162 /* Constructor */) {
                            // show (constructor) Type(...) signature
                            symbolKind = "constructor" /* constructorImplementationElement */;
                            addPrefixForAnyFunctionOrVar(type.symbol, symbolKind);
                        }
                        else {
                            // (function/method) symbol(..signature)
                            addPrefixForAnyFunctionOrVar(functionDeclaration_1.kind === 165 /* CallSignature */ &&
                                !(type.symbol.flags & 2048 /* TypeLiteral */ || type.symbol.flags & 4096 /* ObjectLiteral */) ? type.symbol : symbol, symbolKind);
                        }
                        addSignatureDisplayParts(signature, allSignatures);
                        hasAddedSymbolInfo = true;
                        hasMultipleSignatures = allSignatures.length > 1;
                    }
                }
            }
            if (symbolFlags & 32 /* Class */ && !hasAddedSymbolInfo && !isThisExpression) {
                addAliasPrefixIfNecessary();
                if (ts.getDeclarationOfKind(symbol, 214 /* ClassExpression */)) {
                    // Special case for class expressions because we would like to indicate that
                    // the class name is local to the class body (similar to function expression)
                    //      (local class) class <className>
                    pushSymbolKind("local class" /* localClassElement */);
                }
                else {
                    // Class declaration has name which is not local.
                    displayParts.push(ts.keywordPart(80 /* ClassKeyword */));
                }
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
                writeTypeParametersOfSymbol(symbol, sourceFile);
            }
            if ((symbolFlags & 64 /* Interface */) && (semanticMeaning & 2 /* Type */)) {
                prefixNextMeaning();
                displayParts.push(ts.keywordPart(114 /* InterfaceKeyword */));
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
                writeTypeParametersOfSymbol(symbol, sourceFile);
            }
            if ((symbolFlags & 524288 /* TypeAlias */) && (semanticMeaning & 2 /* Type */)) {
                prefixNextMeaning();
                displayParts.push(ts.keywordPart(145 /* TypeKeyword */));
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
                writeTypeParametersOfSymbol(symbol, sourceFile);
                displayParts.push(ts.spacePart());
                displayParts.push(ts.operatorPart(62 /* EqualsToken */));
                displayParts.push(ts.spacePart());
                ts.addRange(displayParts, ts.typeToDisplayParts(typeChecker, typeChecker.getDeclaredTypeOfSymbol(symbol), enclosingDeclaration, 8388608 /* InTypeAlias */));
            }
            if (symbolFlags & 384 /* Enum */) {
                prefixNextMeaning();
                if (ts.some(symbol.declarations, function (d) { return ts.isEnumDeclaration(d) && ts.isEnumConst(d); })) {
                    displayParts.push(ts.keywordPart(81 /* ConstKeyword */));
                    displayParts.push(ts.spacePart());
                }
                displayParts.push(ts.keywordPart(88 /* EnumKeyword */));
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
            }
            if (symbolFlags & 1536 /* Module */ && !isThisExpression) {
                prefixNextMeaning();
                var declaration = ts.getDeclarationOfKind(symbol, 249 /* ModuleDeclaration */);
                var isNamespace = declaration && declaration.name && declaration.name.kind === 75 /* Identifier */;
                displayParts.push(ts.keywordPart(isNamespace ? 136 /* NamespaceKeyword */ : 135 /* ModuleKeyword */));
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
            }
            if ((symbolFlags & 262144 /* TypeParameter */) && (semanticMeaning & 2 /* Type */)) {
                prefixNextMeaning();
                displayParts.push(ts.punctuationPart(20 /* OpenParenToken */));
                displayParts.push(ts.textPart("type parameter"));
                displayParts.push(ts.punctuationPart(21 /* CloseParenToken */));
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
                if (symbol.parent) {
                    // Class/Interface type parameter
                    addInPrefix();
                    addFullSymbolName(symbol.parent, enclosingDeclaration);
                    writeTypeParametersOfSymbol(symbol.parent, enclosingDeclaration);
                }
                else {
                    // Method/function type parameter
                    var decl = ts.getDeclarationOfKind(symbol, 155 /* TypeParameter */);
                    if (decl === undefined)
                        return ts.Debug.fail();
                    var declaration = decl.parent;
                    if (declaration) {
                        if (ts.isFunctionLikeKind(declaration.kind)) {
                            addInPrefix();
                            var signature = typeChecker.getSignatureFromDeclaration(declaration); // TODO: GH#18217
                            if (declaration.kind === 166 /* ConstructSignature */) {
                                displayParts.push(ts.keywordPart(99 /* NewKeyword */));
                                displayParts.push(ts.spacePart());
                            }
                            else if (declaration.kind !== 165 /* CallSignature */ && declaration.name) {
                                addFullSymbolName(declaration.symbol);
                            }
                            ts.addRange(displayParts, ts.signatureToDisplayParts(typeChecker, signature, sourceFile, 32 /* WriteTypeArgumentsOfSignature */));
                        }
                        else if (declaration.kind === 247 /* TypeAliasDeclaration */) {
                            // Type alias type parameter
                            // For example
                            //      type list<T> = T[]; // Both T will go through same code path
                            addInPrefix();
                            displayParts.push(ts.keywordPart(145 /* TypeKeyword */));
                            displayParts.push(ts.spacePart());
                            addFullSymbolName(declaration.symbol);
                            writeTypeParametersOfSymbol(declaration.symbol, sourceFile);
                        }
                    }
                }
            }
            if (symbolFlags & 8 /* EnumMember */) {
                symbolKind = "enum member" /* enumMemberElement */;
                addPrefixForAnyFunctionOrVar(symbol, "enum member");
                var declaration = symbol.declarations[0];
                if (declaration.kind === 284 /* EnumMember */) {
                    var constantValue = typeChecker.getConstantValue(declaration);
                    if (constantValue !== undefined) {
                        displayParts.push(ts.spacePart());
                        displayParts.push(ts.operatorPart(62 /* EqualsToken */));
                        displayParts.push(ts.spacePart());
                        displayParts.push(ts.displayPart(ts.getTextOfConstantValue(constantValue), typeof constantValue === "number" ? ts.SymbolDisplayPartKind.numericLiteral : ts.SymbolDisplayPartKind.stringLiteral));
                    }
                }
            }
            if (symbolFlags & 2097152 /* Alias */) {
                prefixNextMeaning();
                if (!hasAddedSymbolInfo) {
                    var resolvedSymbol = typeChecker.getAliasedSymbol(symbol);
                    if (resolvedSymbol !== symbol && resolvedSymbol.declarations && resolvedSymbol.declarations.length > 0) {
                        var resolvedNode = resolvedSymbol.declarations[0];
                        var declarationName = ts.getNameOfDeclaration(resolvedNode);
                        if (declarationName) {
                            var isExternalModuleDeclaration = ts.isModuleWithStringLiteralName(resolvedNode) &&
                                ts.hasModifier(resolvedNode, 2 /* Ambient */);
                            var shouldUseAliasName = symbol.name !== "default" && !isExternalModuleDeclaration;
                            var resolvedInfo = getSymbolDisplayPartsDocumentationAndSymbolKind(typeChecker, resolvedSymbol, ts.getSourceFileOfNode(resolvedNode), resolvedNode, declarationName, semanticMeaning, shouldUseAliasName ? symbol : resolvedSymbol);
                            displayParts.push.apply(displayParts, resolvedInfo.displayParts);
                            displayParts.push(ts.lineBreakPart());
                            documentationFromAlias = resolvedInfo.documentation;
                            tagsFromAlias = resolvedInfo.tags;
                        }
                    }
                }
                switch (symbol.declarations[0].kind) {
                    case 252 /* NamespaceExportDeclaration */:
                        displayParts.push(ts.keywordPart(89 /* ExportKeyword */));
                        displayParts.push(ts.spacePart());
                        displayParts.push(ts.keywordPart(136 /* NamespaceKeyword */));
                        break;
                    case 259 /* ExportAssignment */:
                        displayParts.push(ts.keywordPart(89 /* ExportKeyword */));
                        displayParts.push(ts.spacePart());
                        displayParts.push(ts.keywordPart(symbol.declarations[0].isExportEquals ? 62 /* EqualsToken */ : 84 /* DefaultKeyword */));
                        break;
                    case 263 /* ExportSpecifier */:
                        displayParts.push(ts.keywordPart(89 /* ExportKeyword */));
                        break;
                    default:
                        displayParts.push(ts.keywordPart(96 /* ImportKeyword */));
                }
                displayParts.push(ts.spacePart());
                addFullSymbolName(symbol);
                ts.forEach(symbol.declarations, function (declaration) {
                    if (declaration.kind === 253 /* ImportEqualsDeclaration */) {
                        var importEqualsDeclaration = declaration;
                        if (ts.isExternalModuleImportEqualsDeclaration(importEqualsDeclaration)) {
                            displayParts.push(ts.spacePart());
                            displayParts.push(ts.operatorPart(62 /* EqualsToken */));
                            displayParts.push(ts.spacePart());
                            displayParts.push(ts.keywordPart(139 /* RequireKeyword */));
                            displayParts.push(ts.punctuationPart(20 /* OpenParenToken */));
                            displayParts.push(ts.displayPart(ts.getTextOfNode(ts.getExternalModuleImportEqualsDeclarationExpression(importEqualsDeclaration)), ts.SymbolDisplayPartKind.stringLiteral));
                            displayParts.push(ts.punctuationPart(21 /* CloseParenToken */));
                        }
                        else {
                            var internalAliasSymbol = typeChecker.getSymbolAtLocation(importEqualsDeclaration.moduleReference);
                            if (internalAliasSymbol) {
                                displayParts.push(ts.spacePart());
                                displayParts.push(ts.operatorPart(62 /* EqualsToken */));
                                displayParts.push(ts.spacePart());
                                addFullSymbolName(internalAliasSymbol, enclosingDeclaration);
                            }
                        }
                        return true;
                    }
                });
            }
            if (!hasAddedSymbolInfo) {
                if (symbolKind !== "" /* unknown */) {
                    if (type) {
                        if (isThisExpression) {
                            prefixNextMeaning();
                            displayParts.push(ts.keywordPart(104 /* ThisKeyword */));
                        }
                        else {
                            addPrefixForAnyFunctionOrVar(symbol, symbolKind);
                        }
                        // For properties, variables and local vars: show the type
                        if (symbolKind === "property" /* memberVariableElement */ ||
                            symbolKind === "JSX attribute" /* jsxAttribute */ ||
                            symbolFlags & 3 /* Variable */ ||
                            symbolKind === "local var" /* localVariableElement */ ||
                            isThisExpression) {
                            displayParts.push(ts.punctuationPart(58 /* ColonToken */));
                            displayParts.push(ts.spacePart());
                            // If the type is type parameter, format it specially
                            if (type.symbol && type.symbol.flags & 262144 /* TypeParameter */) {
                                var typeParameterParts = ts.mapToDisplayParts(function (writer) {
                                    var param = typeChecker.typeParameterToDeclaration(type, enclosingDeclaration, symbolDisplayNodeBuilderFlags);
                                    getPrinter().writeNode(4 /* Unspecified */, param, ts.getSourceFileOfNode(ts.getParseTreeNode(enclosingDeclaration)), writer);
                                });
                                ts.addRange(displayParts, typeParameterParts);
                            }
                            else {
                                ts.addRange(displayParts, ts.typeToDisplayParts(typeChecker, type, enclosingDeclaration));
                            }
                        }
                        else if (symbolFlags & 16 /* Function */ ||
                            symbolFlags & 8192 /* Method */ ||
                            symbolFlags & 16384 /* Constructor */ ||
                            symbolFlags & 131072 /* Signature */ ||
                            symbolFlags & 98304 /* Accessor */ ||
                            symbolKind === "method" /* memberFunctionElement */) {
                            var allSignatures = type.getNonNullableType().getCallSignatures();
                            if (allSignatures.length) {
                                addSignatureDisplayParts(allSignatures[0], allSignatures);
                                hasMultipleSignatures = allSignatures.length > 1;
                            }
                        }
                    }
                }
                else {
                    symbolKind = getSymbolKind(typeChecker, symbol, location);
                }
            }
            if (documentation.length === 0 && !hasMultipleSignatures) {
                documentation = symbol.getDocumentationComment(typeChecker);
            }
            if (documentation.length === 0 && symbolFlags & 4 /* Property */) {
                // For some special property access expressions like `exports.foo = foo` or `module.exports.foo = foo`
                // there documentation comments might be attached to the right hand side symbol of their declarations.
                // The pattern of such special property access is that the parent symbol is the symbol of the file.
                if (symbol.parent && ts.forEach(symbol.parent.declarations, function (declaration) { return declaration.kind === 290 /* SourceFile */; })) {
                    for (var _i = 0, _a = symbol.declarations; _i < _a.length; _i++) {
                        var declaration = _a[_i];
                        if (!declaration.parent || declaration.parent.kind !== 209 /* BinaryExpression */) {
                            continue;
                        }
                        var rhsSymbol = typeChecker.getSymbolAtLocation(declaration.parent.right);
                        if (!rhsSymbol) {
                            continue;
                        }
                        documentation = rhsSymbol.getDocumentationComment(typeChecker);
                        tags = rhsSymbol.getJsDocTags();
                        if (documentation.length > 0) {
                            break;
                        }
                    }
                }
            }
            if (tags.length === 0 && !hasMultipleSignatures) {
                tags = symbol.getJsDocTags();
            }
            if (documentation.length === 0 && documentationFromAlias) {
                documentation = documentationFromAlias;
            }
            if (tags.length === 0 && tagsFromAlias) {
                tags = tagsFromAlias;
            }
            return { displayParts: displayParts, documentation: documentation, symbolKind: symbolKind, tags: tags.length === 0 ? undefined : tags };
            function getPrinter() {
                if (!printer) {
                    printer = ts.createPrinter({ removeComments: true });
                }
                return printer;
            }
            function prefixNextMeaning() {
                if (displayParts.length) {
                    displayParts.push(ts.lineBreakPart());
                }
                addAliasPrefixIfNecessary();
            }
            function addAliasPrefixIfNecessary() {
                if (alias) {
                    pushSymbolKind("alias" /* alias */);
                    displayParts.push(ts.spacePart());
                }
            }
            function addInPrefix() {
                displayParts.push(ts.spacePart());
                displayParts.push(ts.keywordPart(97 /* InKeyword */));
                displayParts.push(ts.spacePart());
            }
            function addFullSymbolName(symbolToDisplay, enclosingDeclaration) {
                if (alias && symbolToDisplay === symbol) {
                    symbolToDisplay = alias;
                }
                var fullSymbolDisplayParts = ts.symbolToDisplayParts(typeChecker, symbolToDisplay, enclosingDeclaration || sourceFile, /*meaning*/ undefined, 1 /* WriteTypeParametersOrArguments */ | 2 /* UseOnlyExternalAliasing */ | 4 /* AllowAnyNodeKind */);
                ts.addRange(displayParts, fullSymbolDisplayParts);
                if (symbol.flags & 16777216 /* Optional */) {
                    displayParts.push(ts.punctuationPart(57 /* QuestionToken */));
                }
            }
            function addPrefixForAnyFunctionOrVar(symbol, symbolKind) {
                prefixNextMeaning();
                if (symbolKind) {
                    pushSymbolKind(symbolKind);
                    if (symbol && !ts.some(symbol.declarations, function (d) { return ts.isArrowFunction(d) || (ts.isFunctionExpression(d) || ts.isClassExpression(d)) && !d.name; })) {
                        displayParts.push(ts.spacePart());
                        addFullSymbolName(symbol);
                    }
                }
            }
            function pushSymbolKind(symbolKind) {
                switch (symbolKind) {
                    case "var" /* variableElement */:
                    case "function" /* functionElement */:
                    case "let" /* letElement */:
                    case "const" /* constElement */:
                    case "constructor" /* constructorImplementationElement */:
                        displayParts.push(ts.textOrKeywordPart(symbolKind));
                        return;
                    default:
                        displayParts.push(ts.punctuationPart(20 /* OpenParenToken */));
                        displayParts.push(ts.textOrKeywordPart(symbolKind));
                        displayParts.push(ts.punctuationPart(21 /* CloseParenToken */));
                        return;
                }
            }
            function addSignatureDisplayParts(signature, allSignatures, flags) {
                if (flags === void 0) { flags = 0 /* None */; }
                ts.addRange(displayParts, ts.signatureToDisplayParts(typeChecker, signature, enclosingDeclaration, flags | 32 /* WriteTypeArgumentsOfSignature */));
                if (allSignatures.length > 1) {
                    displayParts.push(ts.spacePart());
                    displayParts.push(ts.punctuationPart(20 /* OpenParenToken */));
                    displayParts.push(ts.operatorPart(39 /* PlusToken */));
                    displayParts.push(ts.displayPart((allSignatures.length - 1).toString(), ts.SymbolDisplayPartKind.numericLiteral));
                    displayParts.push(ts.spacePart());
                    displayParts.push(ts.textPart(allSignatures.length === 2 ? "overload" : "overloads"));
                    displayParts.push(ts.punctuationPart(21 /* CloseParenToken */));
                }
                documentation = signature.getDocumentationComment(typeChecker);
                tags = signature.getJsDocTags();
                if (allSignatures.length > 1 && documentation.length === 0 && tags.length === 0) {
                    documentation = allSignatures[0].getDocumentationComment(typeChecker);
                    tags = allSignatures[0].getJsDocTags();
                }
            }
            function writeTypeParametersOfSymbol(symbol, enclosingDeclaration) {
                var typeParameterParts = ts.mapToDisplayParts(function (writer) {
                    var params = typeChecker.symbolToTypeParameterDeclarations(symbol, enclosingDeclaration, symbolDisplayNodeBuilderFlags);
                    getPrinter().writeList(53776 /* TypeParameters */, params, ts.getSourceFileOfNode(ts.getParseTreeNode(enclosingDeclaration)), writer);
                });
                ts.addRange(displayParts, typeParameterParts);
            }
        }
