        function pipelineEmitWithHint(hint, node) {
            ts.Debug.assert(lastNode === node || lastSubstitution === node);
            if (hint === 0)
                return emitSourceFile(ts.cast(node, ts.isSourceFile));
            if (hint === 2)
                return emitIdentifier(ts.cast(node, ts.isIdentifier));
            if (hint === 6)
                return emitLiteral(ts.cast(node, ts.isStringLiteral), true);
            if (hint === 3)
                return emitMappedTypeParameter(ts.cast(node, ts.isTypeParameterDeclaration));
            if (hint === 5) {
                ts.Debug.assertNode(node, ts.isEmptyStatement);
                return emitEmptyStatement(true);
            }
            if (hint === 4) {
                if (ts.isKeyword(node.kind))
                    return writeTokenNode(node, writeKeyword);
                switch (node.kind) {
                    case 15:
                    case 16:
                    case 17:
                        return emitLiteral(node, false);
                    case 292:
                    case 286:
                        return emitUnparsedSourceOrPrepend(node);
                    case 285:
                        return writeUnparsedNode(node);
                    case 287:
                    case 288:
                        return emitUnparsedTextLike(node);
                    case 289:
                        return emitUnparsedSyntheticReference(node);
                    case 75:
                        return emitIdentifier(node);
                    case 76:
                        return emitPrivateIdentifier(node);
                    case 153:
                        return emitQualifiedName(node);
                    case 154:
                        return emitComputedPropertyName(node);
                    case 155:
                        return emitTypeParameter(node);
                    case 156:
                        return emitParameter(node);
                    case 157:
                        return emitDecorator(node);
                    case 158:
                        return emitPropertySignature(node);
                    case 159:
                        return emitPropertyDeclaration(node);
                    case 160:
                        return emitMethodSignature(node);
                    case 161:
                        return emitMethodDeclaration(node);
                    case 162:
                        return emitConstructor(node);
                    case 163:
                    case 164:
                        return emitAccessorDeclaration(node);
                    case 165:
                        return emitCallSignature(node);
                    case 166:
                        return emitConstructSignature(node);
                    case 167:
                        return emitIndexSignature(node);
                    case 168:
                        return emitTypePredicate(node);
                    case 169:
                        return emitTypeReference(node);
                    case 170:
                        return emitFunctionType(node);
                    case 300:
                        return emitJSDocFunctionType(node);
                    case 171:
                        return emitConstructorType(node);
                    case 172:
                        return emitTypeQuery(node);
                    case 173:
                        return emitTypeLiteral(node);
                    case 174:
                        return emitArrayType(node);
                    case 175:
                        return emitTupleType(node);
                    case 176:
                        return emitOptionalType(node);
                    case 178:
                        return emitUnionType(node);
                    case 179:
                        return emitIntersectionType(node);
                    case 180:
                        return emitConditionalType(node);
                    case 181:
                        return emitInferType(node);
                    case 182:
                        return emitParenthesizedType(node);
                    case 216:
                        return emitExpressionWithTypeArguments(node);
                    case 183:
                        return emitThisType();
                    case 184:
                        return emitTypeOperator(node);
                    case 185:
                        return emitIndexedAccessType(node);
                    case 186:
                        return emitMappedType(node);
                    case 187:
                        return emitLiteralType(node);
                    case 188:
                        return emitImportTypeNode(node);
                    case 295:
                        writePunctuation("*");
                        return;
                    case 296:
                        writePunctuation("?");
                        return;
                    case 297:
                        return emitJSDocNullableType(node);
                    case 298:
                        return emitJSDocNonNullableType(node);
                    case 299:
                        return emitJSDocOptionalType(node);
                    case 177:
                    case 301:
                        return emitRestOrJSDocVariadicType(node);
                    case 189:
                        return emitObjectBindingPattern(node);
                    case 190:
                        return emitArrayBindingPattern(node);
                    case 191:
                        return emitBindingElement(node);
                    case 221:
                        return emitTemplateSpan(node);
                    case 222:
                        return emitSemicolonClassElement();
                    case 223:
                        return emitBlock(node);
                    case 225:
                        return emitVariableStatement(node);
                    case 224:
                        return emitEmptyStatement(false);
                    case 226:
                        return emitExpressionStatement(node);
                    case 227:
                        return emitIfStatement(node);
                    case 228:
                        return emitDoStatement(node);
                    case 229:
                        return emitWhileStatement(node);
                    case 230:
                        return emitForStatement(node);
                    case 231:
                        return emitForInStatement(node);
                    case 232:
                        return emitForOfStatement(node);
                    case 233:
                        return emitContinueStatement(node);
                    case 234:
                        return emitBreakStatement(node);
                    case 235:
                        return emitReturnStatement(node);
                    case 236:
                        return emitWithStatement(node);
                    case 237:
                        return emitSwitchStatement(node);
                    case 238:
                        return emitLabeledStatement(node);
                    case 239:
                        return emitThrowStatement(node);
                    case 240:
                        return emitTryStatement(node);
                    case 241:
                        return emitDebuggerStatement(node);
                    case 242:
                        return emitVariableDeclaration(node);
                    case 243:
                        return emitVariableDeclarationList(node);
                    case 244:
                        return emitFunctionDeclaration(node);
                    case 245:
                        return emitClassDeclaration(node);
                    case 246:
                        return emitInterfaceDeclaration(node);
                    case 247:
                        return emitTypeAliasDeclaration(node);
                    case 248:
                        return emitEnumDeclaration(node);
                    case 249:
                        return emitModuleDeclaration(node);
                    case 250:
                        return emitModuleBlock(node);
                    case 251:
                        return emitCaseBlock(node);
                    case 252:
                        return emitNamespaceExportDeclaration(node);
                    case 253:
                        return emitImportEqualsDeclaration(node);
                    case 254:
                        return emitImportDeclaration(node);
                    case 255:
                        return emitImportClause(node);
                    case 256:
                        return emitNamespaceImport(node);
                    case 262:
                        return emitNamespaceExport(node);
                    case 257:
                        return emitNamedImports(node);
                    case 258:
                        return emitImportSpecifier(node);
                    case 259:
                        return emitExportAssignment(node);
                    case 260:
                        return emitExportDeclaration(node);
                    case 261:
                        return emitNamedExports(node);
                    case 263:
                        return emitExportSpecifier(node);
                    case 264:
                        return;
                    case 265:
                        return emitExternalModuleReference(node);
                    case 11:
                        return emitJsxText(node);
                    case 268:
                    case 271:
                        return emitJsxOpeningElementOrFragment(node);
                    case 269:
                    case 272:
                        return emitJsxClosingElementOrFragment(node);
                    case 273:
                        return emitJsxAttribute(node);
                    case 274:
                        return emitJsxAttributes(node);
                    case 275:
                        return emitJsxSpreadAttribute(node);
                    case 276:
                        return emitJsxExpression(node);
                    case 277:
                        return emitCaseClause(node);
                    case 278:
                        return emitDefaultClause(node);
                    case 279:
                        return emitHeritageClause(node);
                    case 280:
                        return emitCatchClause(node);
                    case 281:
                        return emitPropertyAssignment(node);
                    case 282:
                        return emitShorthandPropertyAssignment(node);
                    case 283:
                        return emitSpreadAssignment(node);
                    case 284:
                        return emitEnumMember(node);
                    case 317:
                    case 323:
                        return emitJSDocPropertyLikeTag(node);
                    case 318:
                    case 320:
                    case 319:
                    case 316:
                        return emitJSDocSimpleTypedTag(node);
                    case 308:
                    case 307:
                        return emitJSDocHeritageTag(node);
                    case 321:
                        return emitJSDocTemplateTag(node);
                    case 322:
                        return emitJSDocTypedefTag(node);
                    case 315:
                        return emitJSDocCallbackTag(node);
                    case 305:
                        return emitJSDocSignature(node);
                    case 304:
                        return emitJSDocTypeLiteral(node);
                    case 310:
                    case 306:
                        return emitJSDocSimpleTag(node);
                    case 303:
                        return emitJSDoc(node);
                }
                if (ts.isExpression(node)) {
                    hint = 1;
                    if (substituteNode !== ts.noEmitSubstitution) {
                        lastSubstitution = node = substituteNode(hint, node);
                    }
                }
                else if (ts.isToken(node)) {
                    return writeTokenNode(node, writePunctuation);
                }
            }
            if (hint === 1) {
                switch (node.kind) {
                    case 8:
                    case 9:
                        return emitNumericOrBigIntLiteral(node);
                    case 10:
                    case 13:
                    case 14:
                        return emitLiteral(node, false);
                    case 75:
                        return emitIdentifier(node);
                    case 91:
                    case 100:
                    case 102:
                    case 106:
                    case 104:
                    case 96:
                        writeTokenNode(node, writeKeyword);
                        return;
                    case 192:
                        return emitArrayLiteralExpression(node);
                    case 193:
                        return emitObjectLiteralExpression(node);
                    case 194:
                        return emitPropertyAccessExpression(node);
                    case 195:
                        return emitElementAccessExpression(node);
                    case 196:
                        return emitCallExpression(node);
                    case 197:
                        return emitNewExpression(node);
                    case 198:
                        return emitTaggedTemplateExpression(node);
                    case 199:
                        return emitTypeAssertionExpression(node);
                    case 200:
                        return emitParenthesizedExpression(node);
                    case 201:
                        return emitFunctionExpression(node);
                    case 202:
                        return emitArrowFunction(node);
                    case 203:
                        return emitDeleteExpression(node);
                    case 204:
                        return emitTypeOfExpression(node);
                    case 205:
                        return emitVoidExpression(node);
                    case 206:
                        return emitAwaitExpression(node);
                    case 207:
                        return emitPrefixUnaryExpression(node);
                    case 208:
                        return emitPostfixUnaryExpression(node);
                    case 209:
                        return emitBinaryExpression(node);
                    case 210:
                        return emitConditionalExpression(node);
                    case 211:
                        return emitTemplateExpression(node);
                    case 212:
                        return emitYieldExpression(node);
                    case 213:
                        return emitSpreadExpression(node);
                    case 214:
                        return emitClassExpression(node);
                    case 215:
                        return;
                    case 217:
                        return emitAsExpression(node);
                    case 218:
                        return emitNonNullExpression(node);
                    case 219:
                        return emitMetaProperty(node);
                    case 266:
                        return emitJsxElement(node);
                    case 267:
                        return emitJsxSelfClosingElement(node);
                    case 270:
                        return emitJsxFragment(node);
                    case 326:
                        return emitPartiallyEmittedExpression(node);
                    case 327:
                        return emitCommaList(node);
                }
            }
        }
