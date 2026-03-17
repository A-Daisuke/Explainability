        function pipelineEmitWithHint(hint, node) {
            ts.Debug.assert(lastNode === node || lastSubstitution === node);
            if (hint === 0 /* SourceFile */)
                return emitSourceFile(ts.cast(node, ts.isSourceFile));
            if (hint === 2 /* IdentifierName */)
                return emitIdentifier(ts.cast(node, ts.isIdentifier));
            if (hint === 6 /* JsxAttributeValue */)
                return emitLiteral(ts.cast(node, ts.isStringLiteral), /*jsxAttributeEscape*/ true);
            if (hint === 3 /* MappedTypeParameter */)
                return emitMappedTypeParameter(ts.cast(node, ts.isTypeParameterDeclaration));
            if (hint === 5 /* EmbeddedStatement */) {
                ts.Debug.assertNode(node, ts.isEmptyStatement);
                return emitEmptyStatement(/*isEmbeddedStatement*/ true);
            }
            if (hint === 4 /* Unspecified */) {
                if (ts.isKeyword(node.kind))
                    return writeTokenNode(node, writeKeyword);
                switch (node.kind) {
                    // Pseudo-literals
                    case 15 /* TemplateHead */:
                    case 16 /* TemplateMiddle */:
                    case 17 /* TemplateTail */:
                        return emitLiteral(node, /*jsxAttributeEscape*/ false);
                    case 292 /* UnparsedSource */:
                    case 286 /* UnparsedPrepend */:
                        return emitUnparsedSourceOrPrepend(node);
                    case 285 /* UnparsedPrologue */:
                        return writeUnparsedNode(node);
                    case 287 /* UnparsedText */:
                    case 288 /* UnparsedInternalText */:
                        return emitUnparsedTextLike(node);
                    case 289 /* UnparsedSyntheticReference */:
                        return emitUnparsedSyntheticReference(node);
                    // Identifiers
                    case 75 /* Identifier */:
                        return emitIdentifier(node);
                    // PrivateIdentifiers
                    case 76 /* PrivateIdentifier */:
                        return emitPrivateIdentifier(node);
                    // Parse tree nodes
                    // Names
                    case 153 /* QualifiedName */:
                        return emitQualifiedName(node);
                    case 154 /* ComputedPropertyName */:
                        return emitComputedPropertyName(node);
                    // Signature elements
                    case 155 /* TypeParameter */:
                        return emitTypeParameter(node);
                    case 156 /* Parameter */:
                        return emitParameter(node);
                    case 157 /* Decorator */:
                        return emitDecorator(node);
                    // Type members
                    case 158 /* PropertySignature */:
                        return emitPropertySignature(node);
                    case 159 /* PropertyDeclaration */:
                        return emitPropertyDeclaration(node);
                    case 160 /* MethodSignature */:
                        return emitMethodSignature(node);
                    case 161 /* MethodDeclaration */:
                        return emitMethodDeclaration(node);
                    case 162 /* Constructor */:
                        return emitConstructor(node);
                    case 163 /* GetAccessor */:
                    case 164 /* SetAccessor */:
                        return emitAccessorDeclaration(node);
                    case 165 /* CallSignature */:
                        return emitCallSignature(node);
                    case 166 /* ConstructSignature */:
                        return emitConstructSignature(node);
                    case 167 /* IndexSignature */:
                        return emitIndexSignature(node);
                    // Types
                    case 168 /* TypePredicate */:
                        return emitTypePredicate(node);
                    case 169 /* TypeReference */:
                        return emitTypeReference(node);
                    case 170 /* FunctionType */:
                        return emitFunctionType(node);
                    case 300 /* JSDocFunctionType */:
                        return emitJSDocFunctionType(node);
                    case 171 /* ConstructorType */:
                        return emitConstructorType(node);
                    case 172 /* TypeQuery */:
                        return emitTypeQuery(node);
                    case 173 /* TypeLiteral */:
                        return emitTypeLiteral(node);
                    case 174 /* ArrayType */:
                        return emitArrayType(node);
                    case 175 /* TupleType */:
                        return emitTupleType(node);
                    case 176 /* OptionalType */:
                        return emitOptionalType(node);
                    case 178 /* UnionType */:
                        return emitUnionType(node);
                    case 179 /* IntersectionType */:
                        return emitIntersectionType(node);
                    case 180 /* ConditionalType */:
                        return emitConditionalType(node);
                    case 181 /* InferType */:
                        return emitInferType(node);
                    case 182 /* ParenthesizedType */:
                        return emitParenthesizedType(node);
                    case 216 /* ExpressionWithTypeArguments */:
                        return emitExpressionWithTypeArguments(node);
                    case 183 /* ThisType */:
                        return emitThisType();
                    case 184 /* TypeOperator */:
                        return emitTypeOperator(node);
                    case 185 /* IndexedAccessType */:
                        return emitIndexedAccessType(node);
                    case 186 /* MappedType */:
                        return emitMappedType(node);
                    case 187 /* LiteralType */:
                        return emitLiteralType(node);
                    case 188 /* ImportType */:
                        return emitImportTypeNode(node);
                    case 295 /* JSDocAllType */:
                        writePunctuation("*");
                        return;
                    case 296 /* JSDocUnknownType */:
                        writePunctuation("?");
                        return;
                    case 297 /* JSDocNullableType */:
                        return emitJSDocNullableType(node);
                    case 298 /* JSDocNonNullableType */:
                        return emitJSDocNonNullableType(node);
                    case 299 /* JSDocOptionalType */:
                        return emitJSDocOptionalType(node);
                    case 177 /* RestType */:
                    case 301 /* JSDocVariadicType */:
                        return emitRestOrJSDocVariadicType(node);
                    // Binding patterns
                    case 189 /* ObjectBindingPattern */:
                        return emitObjectBindingPattern(node);
                    case 190 /* ArrayBindingPattern */:
                        return emitArrayBindingPattern(node);
                    case 191 /* BindingElement */:
                        return emitBindingElement(node);
                    // Misc
                    case 221 /* TemplateSpan */:
                        return emitTemplateSpan(node);
                    case 222 /* SemicolonClassElement */:
                        return emitSemicolonClassElement();
                    // Statements
                    case 223 /* Block */:
                        return emitBlock(node);
                    case 225 /* VariableStatement */:
                        return emitVariableStatement(node);
                    case 224 /* EmptyStatement */:
                        return emitEmptyStatement(/*isEmbeddedStatement*/ false);
                    case 226 /* ExpressionStatement */:
                        return emitExpressionStatement(node);
                    case 227 /* IfStatement */:
                        return emitIfStatement(node);
                    case 228 /* DoStatement */:
                        return emitDoStatement(node);
                    case 229 /* WhileStatement */:
                        return emitWhileStatement(node);
                    case 230 /* ForStatement */:
                        return emitForStatement(node);
                    case 231 /* ForInStatement */:
                        return emitForInStatement(node);
                    case 232 /* ForOfStatement */:
                        return emitForOfStatement(node);
                    case 233 /* ContinueStatement */:
                        return emitContinueStatement(node);
                    case 234 /* BreakStatement */:
                        return emitBreakStatement(node);
                    case 235 /* ReturnStatement */:
                        return emitReturnStatement(node);
                    case 236 /* WithStatement */:
                        return emitWithStatement(node);
                    case 237 /* SwitchStatement */:
                        return emitSwitchStatement(node);
                    case 238 /* LabeledStatement */:
                        return emitLabeledStatement(node);
                    case 239 /* ThrowStatement */:
                        return emitThrowStatement(node);
                    case 240 /* TryStatement */:
                        return emitTryStatement(node);
                    case 241 /* DebuggerStatement */:
                        return emitDebuggerStatement(node);
                    // Declarations
                    case 242 /* VariableDeclaration */:
                        return emitVariableDeclaration(node);
                    case 243 /* VariableDeclarationList */:
                        return emitVariableDeclarationList(node);
                    case 244 /* FunctionDeclaration */:
                        return emitFunctionDeclaration(node);
                    case 245 /* ClassDeclaration */:
                        return emitClassDeclaration(node);
                    case 246 /* InterfaceDeclaration */:
                        return emitInterfaceDeclaration(node);
                    case 247 /* TypeAliasDeclaration */:
                        return emitTypeAliasDeclaration(node);
                    case 248 /* EnumDeclaration */:
                        return emitEnumDeclaration(node);
                    case 249 /* ModuleDeclaration */:
                        return emitModuleDeclaration(node);
                    case 250 /* ModuleBlock */:
                        return emitModuleBlock(node);
                    case 251 /* CaseBlock */:
                        return emitCaseBlock(node);
                    case 252 /* NamespaceExportDeclaration */:
                        return emitNamespaceExportDeclaration(node);
                    case 253 /* ImportEqualsDeclaration */:
                        return emitImportEqualsDeclaration(node);
                    case 254 /* ImportDeclaration */:
                        return emitImportDeclaration(node);
                    case 255 /* ImportClause */:
                        return emitImportClause(node);
                    case 256 /* NamespaceImport */:
                        return emitNamespaceImport(node);
                    case 262 /* NamespaceExport */:
                        return emitNamespaceExport(node);
                    case 257 /* NamedImports */:
                        return emitNamedImports(node);
                    case 258 /* ImportSpecifier */:
                        return emitImportSpecifier(node);
                    case 259 /* ExportAssignment */:
                        return emitExportAssignment(node);
                    case 260 /* ExportDeclaration */:
                        return emitExportDeclaration(node);
                    case 261 /* NamedExports */:
                        return emitNamedExports(node);
                    case 263 /* ExportSpecifier */:
                        return emitExportSpecifier(node);
                    case 264 /* MissingDeclaration */:
                        return;
                    // Module references
                    case 265 /* ExternalModuleReference */:
                        return emitExternalModuleReference(node);
                    // JSX (non-expression)
                    case 11 /* JsxText */:
                        return emitJsxText(node);
                    case 268 /* JsxOpeningElement */:
                    case 271 /* JsxOpeningFragment */:
                        return emitJsxOpeningElementOrFragment(node);
                    case 269 /* JsxClosingElement */:
                    case 272 /* JsxClosingFragment */:
                        return emitJsxClosingElementOrFragment(node);
                    case 273 /* JsxAttribute */:
                        return emitJsxAttribute(node);
                    case 274 /* JsxAttributes */:
                        return emitJsxAttributes(node);
                    case 275 /* JsxSpreadAttribute */:
                        return emitJsxSpreadAttribute(node);
                    case 276 /* JsxExpression */:
                        return emitJsxExpression(node);
                    // Clauses
                    case 277 /* CaseClause */:
                        return emitCaseClause(node);
                    case 278 /* DefaultClause */:
                        return emitDefaultClause(node);
                    case 279 /* HeritageClause */:
                        return emitHeritageClause(node);
                    case 280 /* CatchClause */:
                        return emitCatchClause(node);
                    // Property assignments
                    case 281 /* PropertyAssignment */:
                        return emitPropertyAssignment(node);
                    case 282 /* ShorthandPropertyAssignment */:
                        return emitShorthandPropertyAssignment(node);
                    case 283 /* SpreadAssignment */:
                        return emitSpreadAssignment(node);
                    // Enum
                    case 284 /* EnumMember */:
                        return emitEnumMember(node);
                    // JSDoc nodes (only used in codefixes currently)
                    case 317 /* JSDocParameterTag */:
                    case 323 /* JSDocPropertyTag */:
                        return emitJSDocPropertyLikeTag(node);
                    case 318 /* JSDocReturnTag */:
                    case 320 /* JSDocTypeTag */:
                    case 319 /* JSDocThisTag */:
                    case 316 /* JSDocEnumTag */:
                        return emitJSDocSimpleTypedTag(node);
                    case 308 /* JSDocImplementsTag */:
                    case 307 /* JSDocAugmentsTag */:
                        return emitJSDocHeritageTag(node);
                    case 321 /* JSDocTemplateTag */:
                        return emitJSDocTemplateTag(node);
                    case 322 /* JSDocTypedefTag */:
                        return emitJSDocTypedefTag(node);
                    case 315 /* JSDocCallbackTag */:
                        return emitJSDocCallbackTag(node);
                    case 305 /* JSDocSignature */:
                        return emitJSDocSignature(node);
                    case 304 /* JSDocTypeLiteral */:
                        return emitJSDocTypeLiteral(node);
                    case 310 /* JSDocClassTag */:
                    case 306 /* JSDocTag */:
                        return emitJSDocSimpleTag(node);
                    case 303 /* JSDocComment */:
                        return emitJSDoc(node);
                    // Transformation nodes (ignored)
                }
                if (ts.isExpression(node)) {
                    hint = 1 /* Expression */;
                    if (substituteNode !== ts.noEmitSubstitution) {
                        lastSubstitution = node = substituteNode(hint, node);
                    }
                }
                else if (ts.isToken(node)) {
                    return writeTokenNode(node, writePunctuation);
                }
            }
            if (hint === 1 /* Expression */) {
                switch (node.kind) {
                    // Literals
                    case 8 /* NumericLiteral */:
                    case 9 /* BigIntLiteral */:
                        return emitNumericOrBigIntLiteral(node);
                    case 10 /* StringLiteral */:
                    case 13 /* RegularExpressionLiteral */:
                    case 14 /* NoSubstitutionTemplateLiteral */:
                        return emitLiteral(node, /*jsxAttributeEscape*/ false);
                    // Identifiers
                    case 75 /* Identifier */:
                        return emitIdentifier(node);
                    // Reserved words
                    case 91 /* FalseKeyword */:
                    case 100 /* NullKeyword */:
                    case 102 /* SuperKeyword */:
                    case 106 /* TrueKeyword */:
                    case 104 /* ThisKeyword */:
                    case 96 /* ImportKeyword */:
                        writeTokenNode(node, writeKeyword);
                        return;
                    // Expressions
                    case 192 /* ArrayLiteralExpression */:
                        return emitArrayLiteralExpression(node);
                    case 193 /* ObjectLiteralExpression */:
                        return emitObjectLiteralExpression(node);
                    case 194 /* PropertyAccessExpression */:
                        return emitPropertyAccessExpression(node);
                    case 195 /* ElementAccessExpression */:
                        return emitElementAccessExpression(node);
                    case 196 /* CallExpression */:
                        return emitCallExpression(node);
                    case 197 /* NewExpression */:
                        return emitNewExpression(node);
                    case 198 /* TaggedTemplateExpression */:
                        return emitTaggedTemplateExpression(node);
                    case 199 /* TypeAssertionExpression */:
                        return emitTypeAssertionExpression(node);
                    case 200 /* ParenthesizedExpression */:
                        return emitParenthesizedExpression(node);
                    case 201 /* FunctionExpression */:
                        return emitFunctionExpression(node);
                    case 202 /* ArrowFunction */:
                        return emitArrowFunction(node);
                    case 203 /* DeleteExpression */:
                        return emitDeleteExpression(node);
                    case 204 /* TypeOfExpression */:
                        return emitTypeOfExpression(node);
                    case 205 /* VoidExpression */:
                        return emitVoidExpression(node);
                    case 206 /* AwaitExpression */:
                        return emitAwaitExpression(node);
                    case 207 /* PrefixUnaryExpression */:
                        return emitPrefixUnaryExpression(node);
                    case 208 /* PostfixUnaryExpression */:
                        return emitPostfixUnaryExpression(node);
                    case 209 /* BinaryExpression */:
                        return emitBinaryExpression(node);
                    case 210 /* ConditionalExpression */:
                        return emitConditionalExpression(node);
                    case 211 /* TemplateExpression */:
                        return emitTemplateExpression(node);
                    case 212 /* YieldExpression */:
                        return emitYieldExpression(node);
                    case 213 /* SpreadElement */:
                        return emitSpreadExpression(node);
                    case 214 /* ClassExpression */:
                        return emitClassExpression(node);
                    case 215 /* OmittedExpression */:
                        return;
                    case 217 /* AsExpression */:
                        return emitAsExpression(node);
                    case 218 /* NonNullExpression */:
                        return emitNonNullExpression(node);
                    case 219 /* MetaProperty */:
                        return emitMetaProperty(node);
                    // JSX
                    case 266 /* JsxElement */:
                        return emitJsxElement(node);
                    case 267 /* JsxSelfClosingElement */:
                        return emitJsxSelfClosingElement(node);
                    case 270 /* JsxFragment */:
                        return emitJsxFragment(node);
                    // Transformation nodes
                    case 326 /* PartiallyEmittedExpression */:
                        return emitPartiallyEmittedExpression(node);
                    case 327 /* CommaListExpression */:
                        return emitCommaList(node);
                }
            }
        }
