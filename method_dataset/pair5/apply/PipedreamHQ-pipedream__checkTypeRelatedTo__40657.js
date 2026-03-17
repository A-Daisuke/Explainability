        function checkTypeRelatedTo(source, target, relation, errorNode, headMessage, containingMessageChain, errorOutputContainer) {
            var errorInfo;
            var relatedInfo;
            var maybeKeys;
            var sourceStack;
            var targetStack;
            var maybeCount = 0;
            var depth = 0;
            var expandingFlags = 0;
            var overflow = false;
            var overrideNextErrorInfo = 0;
            var lastSkippedInfo;
            var incompatibleStack = [];
            var inPropertyCheck = false;
            ts.Debug.assert(relation !== identityRelation || !errorNode, "no error reporting in identity checking");
            var result = isRelatedTo(source, target, !!errorNode, headMessage);
            if (incompatibleStack.length) {
                reportIncompatibleStack();
            }
            if (overflow) {
                var diag = error(errorNode || currentNode, ts.Diagnostics.Excessive_stack_depth_comparing_types_0_and_1, typeToString(source), typeToString(target));
                if (errorOutputContainer) {
                    (errorOutputContainer.errors || (errorOutputContainer.errors = [])).push(diag);
                }
            }
            else if (errorInfo) {
                if (containingMessageChain) {
                    var chain = containingMessageChain();
                    if (chain) {
                        ts.concatenateDiagnosticMessageChains(chain, errorInfo);
                        errorInfo = chain;
                    }
                }
                var relatedInformation = void 0;
                if (headMessage && errorNode && !result && source.symbol) {
                    var links = getSymbolLinks(source.symbol);
                    if (links.originatingImport && !ts.isImportCall(links.originatingImport)) {
                        var helpfulRetry = checkTypeRelatedTo(getTypeOfSymbol(links.target), target, relation, undefined);
                        if (helpfulRetry) {
                            var diag_1 = ts.createDiagnosticForNode(links.originatingImport, ts.Diagnostics.Type_originates_at_this_import_A_namespace_style_import_cannot_be_called_or_constructed_and_will_cause_a_failure_at_runtime_Consider_using_a_default_import_or_import_require_here_instead);
                            relatedInformation = ts.append(relatedInformation, diag_1);
                        }
                    }
                }
                var diag = ts.createDiagnosticForNodeFromMessageChain(errorNode, errorInfo, relatedInformation);
                if (relatedInfo) {
                    ts.addRelatedInfo.apply(void 0, __spreadArrays([diag], relatedInfo));
                }
                if (errorOutputContainer) {
                    (errorOutputContainer.errors || (errorOutputContainer.errors = [])).push(diag);
                }
                if (!errorOutputContainer || !errorOutputContainer.skipLogging) {
                    diagnostics.add(diag);
                }
            }
            if (errorNode && errorOutputContainer && errorOutputContainer.skipLogging && result === 0) {
                ts.Debug.assert(!!errorOutputContainer.errors, "missed opportunity to interact with error.");
            }
            return result !== 0;
            function resetErrorInfo(saved) {
                errorInfo = saved.errorInfo;
                lastSkippedInfo = saved.lastSkippedInfo;
                incompatibleStack = saved.incompatibleStack;
                overrideNextErrorInfo = saved.overrideNextErrorInfo;
                relatedInfo = saved.relatedInfo;
            }
            function captureErrorCalculationState() {
                return {
                    errorInfo: errorInfo,
                    lastSkippedInfo: lastSkippedInfo,
                    incompatibleStack: incompatibleStack.slice(),
                    overrideNextErrorInfo: overrideNextErrorInfo,
                    relatedInfo: !relatedInfo ? undefined : relatedInfo.slice()
                };
            }
            function reportIncompatibleError(message, arg0, arg1, arg2, arg3) {
                overrideNextErrorInfo++;
                lastSkippedInfo = undefined;
                incompatibleStack.push([message, arg0, arg1, arg2, arg3]);
            }
            function reportIncompatibleStack() {
                var stack = incompatibleStack;
                incompatibleStack = [];
                var info = lastSkippedInfo;
                lastSkippedInfo = undefined;
                if (stack.length === 1) {
                    reportError.apply(void 0, stack[0]);
                    if (info) {
                        reportRelationError.apply(void 0, __spreadArrays([undefined], info));
                    }
                    return;
                }
                var path = "";
                var secondaryRootErrors = [];
                while (stack.length) {
                    var _a = stack.pop(), msg = _a[0], args = _a.slice(1);
                    switch (msg.code) {
                        case ts.Diagnostics.Types_of_property_0_are_incompatible.code: {
                            if (path.indexOf("new ") === 0) {
                                path = "(" + path + ")";
                            }
                            var str = "" + args[0];
                            if (path.length === 0) {
                                path = "" + str;
                            }
                            else if (ts.isIdentifierText(str, compilerOptions.target)) {
                                path = path + "." + str;
                            }
                            else if (str[0] === "[" && str[str.length - 1] === "]") {
                                path = "" + path + str;
                            }
                            else {
                                path = path + "[" + str + "]";
                            }
                            break;
                        }
                        case ts.Diagnostics.Call_signature_return_types_0_and_1_are_incompatible.code:
                        case ts.Diagnostics.Construct_signature_return_types_0_and_1_are_incompatible.code:
                        case ts.Diagnostics.Call_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code:
                        case ts.Diagnostics.Construct_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code: {
                            if (path.length === 0) {
                                var mappedMsg = msg;
                                if (msg.code === ts.Diagnostics.Call_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code) {
                                    mappedMsg = ts.Diagnostics.Call_signature_return_types_0_and_1_are_incompatible;
                                }
                                else if (msg.code === ts.Diagnostics.Construct_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code) {
                                    mappedMsg = ts.Diagnostics.Construct_signature_return_types_0_and_1_are_incompatible;
                                }
                                secondaryRootErrors.unshift([mappedMsg, args[0], args[1]]);
                            }
                            else {
                                var prefix = (msg.code === ts.Diagnostics.Construct_signature_return_types_0_and_1_are_incompatible.code ||
                                    msg.code === ts.Diagnostics.Construct_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code)
                                    ? "new "
                                    : "";
                                var params = (msg.code === ts.Diagnostics.Call_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code ||
                                    msg.code === ts.Diagnostics.Construct_signatures_with_no_arguments_have_incompatible_return_types_0_and_1.code)
                                    ? ""
                                    : "...";
                                path = "" + prefix + path + "(" + params + ")";
                            }
                            break;
                        }
                        default:
                            return ts.Debug.fail("Unhandled Diagnostic: " + msg.code);
                    }
                }
                if (path) {
                    reportError(path[path.length - 1] === ")"
                        ? ts.Diagnostics.The_types_returned_by_0_are_incompatible_between_these_types
                        : ts.Diagnostics.The_types_of_0_are_incompatible_between_these_types, path);
                }
                else {
                    secondaryRootErrors.shift();
                }
                for (var _i = 0, secondaryRootErrors_1 = secondaryRootErrors; _i < secondaryRootErrors_1.length; _i++) {
                    var _b = secondaryRootErrors_1[_i], msg = _b[0], args = _b.slice(1);
                    var originalValue = msg.elidedInCompatabilityPyramid;
                    msg.elidedInCompatabilityPyramid = false;
                    reportError.apply(void 0, __spreadArrays([msg], args));
                    msg.elidedInCompatabilityPyramid = originalValue;
                }
                if (info) {
                    reportRelationError.apply(void 0, __spreadArrays([undefined], info));
                }
            }
            function reportError(message, arg0, arg1, arg2, arg3) {
                ts.Debug.assert(!!errorNode);
                if (incompatibleStack.length)
                    reportIncompatibleStack();
                if (message.elidedInCompatabilityPyramid)
                    return;
                errorInfo = ts.chainDiagnosticMessages(errorInfo, message, arg0, arg1, arg2, arg3);
            }
            function associateRelatedInfo(info) {
                ts.Debug.assert(!!errorInfo);
                if (!relatedInfo) {
                    relatedInfo = [info];
                }
                else {
                    relatedInfo.push(info);
                }
            }
            function reportRelationError(message, source, target) {
                if (incompatibleStack.length)
                    reportIncompatibleStack();
                var _a = getTypeNamesForErrorDisplay(source, target), sourceType = _a[0], targetType = _a[1];
                if (target.flags & 262144) {
                    var constraint = getBaseConstraintOfType(target);
                    var constraintElab = constraint && isTypeAssignableTo(source, constraint);
                    if (constraintElab) {
                        reportError(ts.Diagnostics._0_is_assignable_to_the_constraint_of_type_1_but_1_could_be_instantiated_with_a_different_subtype_of_constraint_2, sourceType, targetType, typeToString(constraint));
                    }
                    else {
                        reportError(ts.Diagnostics._0_could_be_instantiated_with_an_arbitrary_type_which_could_be_unrelated_to_1, targetType, sourceType);
                    }
                }
                if (!message) {
                    if (relation === comparableRelation) {
                        message = ts.Diagnostics.Type_0_is_not_comparable_to_type_1;
                    }
                    else if (sourceType === targetType) {
                        message = ts.Diagnostics.Type_0_is_not_assignable_to_type_1_Two_different_types_with_this_name_exist_but_they_are_unrelated;
                    }
                    else {
                        message = ts.Diagnostics.Type_0_is_not_assignable_to_type_1;
                    }
                }
                reportError(message, sourceType, targetType);
            }
            function tryElaborateErrorsForPrimitivesAndObjects(source, target) {
                var sourceType = symbolValueDeclarationIsContextSensitive(source.symbol) ? typeToString(source, source.symbol.valueDeclaration) : typeToString(source);
                var targetType = symbolValueDeclarationIsContextSensitive(target.symbol) ? typeToString(target, target.symbol.valueDeclaration) : typeToString(target);
                if ((globalStringType === source && stringType === target) ||
                    (globalNumberType === source && numberType === target) ||
                    (globalBooleanType === source && booleanType === target) ||
                    (getGlobalESSymbolType(false) === source && esSymbolType === target)) {
                    reportError(ts.Diagnostics._0_is_a_primitive_but_1_is_a_wrapper_object_Prefer_using_0_when_possible, targetType, sourceType);
                }
            }
            function tryElaborateArrayLikeErrors(source, target, reportErrors) {
                if (isTupleType(source)) {
                    if (source.target.readonly && isMutableArrayOrTuple(target)) {
                        if (reportErrors) {
                            reportError(ts.Diagnostics.The_type_0_is_readonly_and_cannot_be_assigned_to_the_mutable_type_1, typeToString(source), typeToString(target));
                        }
                        return false;
                    }
                    return isTupleType(target) || isArrayType(target);
                }
                if (isReadonlyArrayType(source) && isMutableArrayOrTuple(target)) {
                    if (reportErrors) {
                        reportError(ts.Diagnostics.The_type_0_is_readonly_and_cannot_be_assigned_to_the_mutable_type_1, typeToString(source), typeToString(target));
                    }
                    return false;
                }
                if (isTupleType(target)) {
                    return isArrayType(source);
                }
                return true;
            }
            function isRelatedTo(originalSource, originalTarget, reportErrors, headMessage, intersectionState) {
                if (reportErrors === void 0) { reportErrors = false; }
                if (intersectionState === void 0) { intersectionState = 0; }
                if (originalSource.flags & 524288 && originalTarget.flags & 131068) {
                    if (isSimpleTypeRelatedTo(originalSource, originalTarget, relation, reportErrors ? reportError : undefined)) {
                        return -1;
                    }
                    reportErrorResults(originalSource, originalTarget, 0, !!(ts.getObjectFlags(originalSource) & 4096));
                    return 0;
                }
                var source = getNormalizedType(originalSource, false);
                var target = getNormalizedType(originalTarget, true);
                if (source === target)
                    return -1;
                if (relation === identityRelation) {
                    return isIdenticalTo(source, target);
                }
                if (source.flags & 262144 && getConstraintOfType(source) === target) {
                    return -1;
                }
                if (target.flags & 1048576 && source.flags & 524288 &&
                    target.types.length <= 3 && maybeTypeOfKind(target, 98304)) {
                    var nullStrippedTarget = extractTypesOfKind(target, ~98304);
                    if (!(nullStrippedTarget.flags & (1048576 | 131072))) {
                        if (source === nullStrippedTarget)
                            return -1;
                        target = nullStrippedTarget;
                    }
                }
                if (relation === comparableRelation && !(target.flags & 131072) && isSimpleTypeRelatedTo(target, source, relation) ||
                    isSimpleTypeRelatedTo(source, target, relation, reportErrors ? reportError : undefined))
                    return -1;
                var isComparingJsxAttributes = !!(ts.getObjectFlags(source) & 4096);
                var isPerformingExcessPropertyChecks = !(intersectionState & 2) && (isObjectLiteralType(source) && ts.getObjectFlags(source) & 32768);
                if (isPerformingExcessPropertyChecks) {
                    if (hasExcessProperties(source, target, reportErrors)) {
                        if (reportErrors) {
                            reportRelationError(headMessage, source, target);
                        }
                        return 0;
                    }
                }
                var isPerformingCommonPropertyChecks = relation !== comparableRelation && !(intersectionState & 2) &&
                    source.flags & (131068 | 524288 | 2097152) && source !== globalObjectType &&
                    target.flags & (524288 | 2097152) && isWeakType(target) &&
                    (getPropertiesOfType(source).length > 0 || typeHasCallOrConstructSignatures(source));
                if (isPerformingCommonPropertyChecks && !hasCommonProperties(source, target, isComparingJsxAttributes)) {
                    if (reportErrors) {
                        var calls = getSignaturesOfType(source, 0);
                        var constructs = getSignaturesOfType(source, 1);
                        if (calls.length > 0 && isRelatedTo(getReturnTypeOfSignature(calls[0]), target, false) ||
                            constructs.length > 0 && isRelatedTo(getReturnTypeOfSignature(constructs[0]), target, false)) {
                            reportError(ts.Diagnostics.Value_of_type_0_has_no_properties_in_common_with_type_1_Did_you_mean_to_call_it, typeToString(source), typeToString(target));
                        }
                        else {
                            reportError(ts.Diagnostics.Type_0_has_no_properties_in_common_with_type_1, typeToString(source), typeToString(target));
                        }
                    }
                    return 0;
                }
                var result = 0;
                var saveErrorInfo = captureErrorCalculationState();
                if (source.flags & 1048576) {
                    result = relation === comparableRelation ?
                        someTypeRelatedToType(source, target, reportErrors && !(source.flags & 131068), intersectionState) :
                        eachTypeRelatedToType(source, target, reportErrors && !(source.flags & 131068), intersectionState);
                }
                else {
                    if (target.flags & 1048576) {
                        result = typeRelatedToSomeType(getRegularTypeOfObjectLiteral(source), target, reportErrors && !(source.flags & 131068) && !(target.flags & 131068));
                    }
                    else if (target.flags & 2097152) {
                        result = typeRelatedToEachType(getRegularTypeOfObjectLiteral(source), target, reportErrors, 2);
                    }
                    else if (source.flags & 2097152) {
                        result = someTypeRelatedToType(source, target, false, 1);
                    }
                    if (!result && (source.flags & 66846720 || target.flags & 66846720)) {
                        if (result = recursiveTypeRelatedTo(source, target, reportErrors, intersectionState)) {
                            resetErrorInfo(saveErrorInfo);
                        }
                    }
                }
                if (!result && source.flags & (2097152 | 262144)) {
                    var constraint = getEffectiveConstraintOfIntersection(source.flags & 2097152 ? source.types : [source], !!(target.flags & 1048576));
                    if (constraint && (source.flags & 2097152 || target.flags & 1048576)) {
                        if (everyType(constraint, function (c) { return c !== source; })) {
                            if (result = isRelatedTo(constraint, target, false, undefined, intersectionState)) {
                                resetErrorInfo(saveErrorInfo);
                            }
                        }
                    }
                }
                if (result && !inPropertyCheck && (target.flags & 2097152 && (isPerformingExcessPropertyChecks || isPerformingCommonPropertyChecks) ||
                    isNonGenericObjectType(target) && !isArrayType(target) && !isTupleType(target) && source.flags & 2097152 && getApparentType(source).flags & 3670016 && !ts.some(source.types, function (t) { return !!(ts.getObjectFlags(t) & 2097152); }))) {
                    inPropertyCheck = true;
                    result &= recursiveTypeRelatedTo(source, target, reportErrors, 4);
                    inPropertyCheck = false;
                }
                reportErrorResults(source, target, result, isComparingJsxAttributes);
                return result;
                function reportErrorResults(source, target, result, isComparingJsxAttributes) {
                    if (!result && reportErrors) {
                        source = originalSource.aliasSymbol ? originalSource : source;
                        target = originalTarget.aliasSymbol ? originalTarget : target;
                        var maybeSuppress = overrideNextErrorInfo > 0;
                        if (maybeSuppress) {
                            overrideNextErrorInfo--;
                        }
                        if (source.flags & 524288 && target.flags & 524288) {
                            var currentError = errorInfo;
                            tryElaborateArrayLikeErrors(source, target, reportErrors);
                            if (errorInfo !== currentError) {
                                maybeSuppress = !!errorInfo;
                            }
                        }
                        if (source.flags & 524288 && target.flags & 131068) {
                            tryElaborateErrorsForPrimitivesAndObjects(source, target);
                        }
                        else if (source.symbol && source.flags & 524288 && globalObjectType === source) {
                            reportError(ts.Diagnostics.The_Object_type_is_assignable_to_very_few_other_types_Did_you_mean_to_use_the_any_type_instead);
                        }
                        else if (isComparingJsxAttributes && target.flags & 2097152) {
                            var targetTypes = target.types;
                            var intrinsicAttributes = getJsxType(JsxNames.IntrinsicAttributes, errorNode);
                            var intrinsicClassAttributes = getJsxType(JsxNames.IntrinsicClassAttributes, errorNode);
                            if (intrinsicAttributes !== errorType && intrinsicClassAttributes !== errorType &&
                                (ts.contains(targetTypes, intrinsicAttributes) || ts.contains(targetTypes, intrinsicClassAttributes))) {
                                return result;
                            }
                        }
                        else {
                            errorInfo = elaborateNeverIntersection(errorInfo, originalTarget);
                        }
                        if (!headMessage && maybeSuppress) {
                            lastSkippedInfo = [source, target];
                            return result;
                        }
                        reportRelationError(headMessage, source, target);
                    }
                }
            }
            function isIdenticalTo(source, target) {
                var flags = source.flags & target.flags;
                if (!(flags & 66584576)) {
                    return 0;
                }
                if (flags & 3145728) {
                    var result_5 = eachTypeRelatedToSomeType(source, target);
                    if (result_5) {
                        result_5 &= eachTypeRelatedToSomeType(target, source);
                    }
                    return result_5;
                }
                return recursiveTypeRelatedTo(source, target, false, 0);
            }
            function getTypeOfPropertyInTypes(types, name) {
                var appendPropType = function (propTypes, type) {
                    type = getApparentType(type);
                    var prop = type.flags & 3145728 ? getPropertyOfUnionOrIntersectionType(type, name) : getPropertyOfObjectType(type, name);
                    var propType = prop && getTypeOfSymbol(prop) || isNumericLiteralName(name) && getIndexTypeOfType(type, 1) || getIndexTypeOfType(type, 0) || undefinedType;
                    return ts.append(propTypes, propType);
                };
                return getUnionType(ts.reduceLeft(types, appendPropType, undefined) || ts.emptyArray);
            }
            function hasExcessProperties(source, target, reportErrors) {
                if (!isExcessPropertyCheckTarget(target) || !noImplicitAny && ts.getObjectFlags(target) & 16384) {
                    return false;
                }
                var isComparingJsxAttributes = !!(ts.getObjectFlags(source) & 4096);
                if ((relation === assignableRelation || relation === comparableRelation) &&
                    (isTypeSubsetOf(globalObjectType, target) || (!isComparingJsxAttributes && isEmptyObjectType(target)))) {
                    return false;
                }
                var reducedTarget = target;
                var checkTypes;
                if (target.flags & 1048576) {
                    reducedTarget = findMatchingDiscriminantType(source, target, isRelatedTo) || filterPrimitivesIfContainsNonPrimitive(target);
                    checkTypes = reducedTarget.flags & 1048576 ? reducedTarget.types : [reducedTarget];
                }
                var _loop_13 = function (prop) {
                    if (shouldCheckAsExcessProperty(prop, source.symbol) && !isIgnoredJsxProperty(source, prop)) {
                        if (!isKnownProperty(reducedTarget, prop.escapedName, isComparingJsxAttributes)) {
                            if (reportErrors) {
                                var errorTarget = filterType(reducedTarget, isExcessPropertyCheckTarget);
                                if (!errorNode)
                                    return { value: ts.Debug.fail() };
                                if (ts.isJsxAttributes(errorNode) || ts.isJsxOpeningLikeElement(errorNode) || ts.isJsxOpeningLikeElement(errorNode.parent)) {
                                    if (prop.valueDeclaration && ts.isJsxAttribute(prop.valueDeclaration) && ts.getSourceFileOfNode(errorNode) === ts.getSourceFileOfNode(prop.valueDeclaration.name)) {
                                        errorNode = prop.valueDeclaration.name;
                                    }
                                    reportError(ts.Diagnostics.Property_0_does_not_exist_on_type_1, symbolToString(prop), typeToString(errorTarget));
                                }
                                else {
                                    var objectLiteralDeclaration_1 = source.symbol && ts.firstOrUndefined(source.symbol.declarations);
                                    var suggestion = void 0;
                                    if (prop.valueDeclaration && ts.findAncestor(prop.valueDeclaration, function (d) { return d === objectLiteralDeclaration_1; }) && ts.getSourceFileOfNode(objectLiteralDeclaration_1) === ts.getSourceFileOfNode(errorNode)) {
                                        var propDeclaration = prop.valueDeclaration;
                                        ts.Debug.assertNode(propDeclaration, ts.isObjectLiteralElementLike);
                                        errorNode = propDeclaration;
                                        var name = propDeclaration.name;
                                        if (ts.isIdentifier(name)) {
                                            suggestion = getSuggestionForNonexistentProperty(name, errorTarget);
                                        }
                                    }
                                    if (suggestion !== undefined) {
                                        reportError(ts.Diagnostics.Object_literal_may_only_specify_known_properties_but_0_does_not_exist_in_type_1_Did_you_mean_to_write_2, symbolToString(prop), typeToString(errorTarget), suggestion);
                                    }
                                    else {
                                        reportError(ts.Diagnostics.Object_literal_may_only_specify_known_properties_and_0_does_not_exist_in_type_1, symbolToString(prop), typeToString(errorTarget));
                                    }
                                }
                            }
                            return { value: true };
                        }
                        if (checkTypes && !isRelatedTo(getTypeOfSymbol(prop), getTypeOfPropertyInTypes(checkTypes, prop.escapedName), reportErrors)) {
                            if (reportErrors) {
                                reportIncompatibleError(ts.Diagnostics.Types_of_property_0_are_incompatible, symbolToString(prop));
                            }
                            return { value: true };
                        }
                    }
                };
                for (var _i = 0, _a = getPropertiesOfType(source); _i < _a.length; _i++) {
                    var prop = _a[_i];
                    var state_5 = _loop_13(prop);
                    if (typeof state_5 === "object")
                        return state_5.value;
                }
                return false;
            }
            function shouldCheckAsExcessProperty(prop, container) {
                return prop.valueDeclaration && container.valueDeclaration && prop.valueDeclaration.parent === container.valueDeclaration;
            }
            function eachTypeRelatedToSomeType(source, target) {
                var result = -1;
                var sourceTypes = source.types;
                for (var _i = 0, sourceTypes_1 = sourceTypes; _i < sourceTypes_1.length; _i++) {
                    var sourceType = sourceTypes_1[_i];
                    var related = typeRelatedToSomeType(sourceType, target, false);
                    if (!related) {
                        return 0;
                    }
                    result &= related;
                }
                return result;
            }
            function typeRelatedToSomeType(source, target, reportErrors) {
                var targetTypes = target.types;
                if (target.flags & 1048576 && containsType(targetTypes, source)) {
                    return -1;
                }
                for (var _i = 0, targetTypes_1 = targetTypes; _i < targetTypes_1.length; _i++) {
                    var type = targetTypes_1[_i];
                    var related = isRelatedTo(source, type, false);
                    if (related) {
                        return related;
                    }
                }
                if (reportErrors) {
                    var bestMatchingType = getBestMatchingType(source, target, isRelatedTo);
                    isRelatedTo(source, bestMatchingType || targetTypes[targetTypes.length - 1], true);
                }
                return 0;
            }
            function typeRelatedToEachType(source, target, reportErrors, intersectionState) {
                var result = -1;
                var targetTypes = target.types;
                for (var _i = 0, targetTypes_2 = targetTypes; _i < targetTypes_2.length; _i++) {
                    var targetType = targetTypes_2[_i];
                    var related = isRelatedTo(source, targetType, reportErrors, undefined, intersectionState);
                    if (!related) {
                        return 0;
                    }
                    result &= related;
                }
                return result;
            }
            function someTypeRelatedToType(source, target, reportErrors, intersectionState) {
                var sourceTypes = source.types;
                if (source.flags & 1048576 && containsType(sourceTypes, target)) {
                    return -1;
                }
                var len = sourceTypes.length;
                for (var i = 0; i < len; i++) {
                    var related = isRelatedTo(sourceTypes[i], target, reportErrors && i === len - 1, undefined, intersectionState);
                    if (related) {
                        return related;
                    }
                }
                return 0;
            }
            function eachTypeRelatedToType(source, target, reportErrors, intersectionState) {
                var result = -1;
                var sourceTypes = source.types;
                for (var i = 0; i < sourceTypes.length; i++) {
                    var sourceType = sourceTypes[i];
                    if (target.flags & 1048576 && target.types.length === sourceTypes.length) {
                        var related_1 = isRelatedTo(sourceType, target.types[i], false, undefined, intersectionState);
                        if (related_1) {
                            result &= related_1;
                            continue;
                        }
                    }
                    var related = isRelatedTo(sourceType, target, reportErrors, undefined, intersectionState);
                    if (!related) {
                        return 0;
                    }
                    result &= related;
                }
                return result;
            }
            function typeArgumentsRelatedTo(sources, targets, variances, reportErrors, intersectionState) {
                if (sources === void 0) { sources = ts.emptyArray; }
                if (targets === void 0) { targets = ts.emptyArray; }
                if (variances === void 0) { variances = ts.emptyArray; }
                if (sources.length !== targets.length && relation === identityRelation) {
                    return 0;
                }
                var length = sources.length <= targets.length ? sources.length : targets.length;
                var result = -1;
                for (var i = 0; i < length; i++) {
                    var varianceFlags = i < variances.length ? variances[i] : 1;
                    var variance = varianceFlags & 7;
                    if (variance !== 4) {
                        var s = sources[i];
                        var t = targets[i];
                        var related = -1;
                        if (varianceFlags & 8) {
                            related = relation === identityRelation ? isRelatedTo(s, t, false) : compareTypesIdentical(s, t);
                        }
                        else if (variance === 1) {
                            related = isRelatedTo(s, t, reportErrors, undefined, intersectionState);
                        }
                        else if (variance === 2) {
                            related = isRelatedTo(t, s, reportErrors, undefined, intersectionState);
                        }
                        else if (variance === 3) {
                            related = isRelatedTo(t, s, false);
                            if (!related) {
                                related = isRelatedTo(s, t, reportErrors, undefined, intersectionState);
                            }
                        }
                        else {
                            related = isRelatedTo(s, t, reportErrors, undefined, intersectionState);
                            if (related) {
                                related &= isRelatedTo(t, s, reportErrors, undefined, intersectionState);
                            }
                        }
                        if (!related) {
                            return 0;
                        }
                        result &= related;
                    }
                }
                return result;
            }
            function recursiveTypeRelatedTo(source, target, reportErrors, intersectionState) {
                if (overflow) {
                    return 0;
                }
                var id = getRelationKey(source, target, intersectionState | (inPropertyCheck ? 8 : 0), relation);
                var entry = relation.get(id);
                if (entry !== undefined) {
                    if (reportErrors && entry & 2 && !(entry & 4)) {
                    }
                    else {
                        if (outofbandVarianceMarkerHandler) {
                            var saved = entry & 24;
                            if (saved & 8) {
                                instantiateType(source, makeFunctionTypeMapper(reportUnmeasurableMarkers));
                            }
                            if (saved & 16) {
                                instantiateType(source, makeFunctionTypeMapper(reportUnreliableMarkers));
                            }
                        }
                        return entry & 1 ? -1 : 0;
                    }
                }
                if (!maybeKeys) {
                    maybeKeys = [];
                    sourceStack = [];
                    targetStack = [];
                }
                else {
                    for (var i = 0; i < maybeCount; i++) {
                        if (id === maybeKeys[i]) {
                            return 1;
                        }
                    }
                    if (depth === 100) {
                        overflow = true;
                        return 0;
                    }
                }
                var maybeStart = maybeCount;
                maybeKeys[maybeCount] = id;
                maybeCount++;
                sourceStack[depth] = source;
                targetStack[depth] = target;
                depth++;
                var saveExpandingFlags = expandingFlags;
                if (!(expandingFlags & 1) && isDeeplyNestedType(source, sourceStack, depth))
                    expandingFlags |= 1;
                if (!(expandingFlags & 2) && isDeeplyNestedType(target, targetStack, depth))
                    expandingFlags |= 2;
                var originalHandler;
                var propagatingVarianceFlags = 0;
                if (outofbandVarianceMarkerHandler) {
                    originalHandler = outofbandVarianceMarkerHandler;
                    outofbandVarianceMarkerHandler = function (onlyUnreliable) {
                        propagatingVarianceFlags |= onlyUnreliable ? 16 : 8;
                        return originalHandler(onlyUnreliable);
                    };
                }
                var result = expandingFlags !== 3 ? structuredTypeRelatedTo(source, target, reportErrors, intersectionState) : 1;
                if (outofbandVarianceMarkerHandler) {
                    outofbandVarianceMarkerHandler = originalHandler;
                }
                expandingFlags = saveExpandingFlags;
                depth--;
                if (result) {
                    if (result === -1 || depth === 0) {
                        for (var i = maybeStart; i < maybeCount; i++) {
                            relation.set(maybeKeys[i], 1 | propagatingVarianceFlags);
                        }
                        maybeCount = maybeStart;
                    }
                }
                else {
                    relation.set(id, (reportErrors ? 4 : 0) | 2 | propagatingVarianceFlags);
                    maybeCount = maybeStart;
                }
                return result;
            }
            function structuredTypeRelatedTo(source, target, reportErrors, intersectionState) {
                if (intersectionState & 4) {
                    return propertiesRelatedTo(source, target, reportErrors, undefined, 0);
                }
                var flags = source.flags & target.flags;
                if (relation === identityRelation && !(flags & 524288)) {
                    if (flags & 4194304) {
                        return isRelatedTo(source.type, target.type, false);
                    }
                    var result_6 = 0;
                    if (flags & 8388608) {
                        if (result_6 = isRelatedTo(source.objectType, target.objectType, false)) {
                            if (result_6 &= isRelatedTo(source.indexType, target.indexType, false)) {
                                return result_6;
                            }
                        }
                    }
                    if (flags & 16777216) {
                        if (source.root.isDistributive === target.root.isDistributive) {
                            if (result_6 = isRelatedTo(source.checkType, target.checkType, false)) {
                                if (result_6 &= isRelatedTo(source.extendsType, target.extendsType, false)) {
                                    if (result_6 &= isRelatedTo(getTrueTypeFromConditionalType(source), getTrueTypeFromConditionalType(target), false)) {
                                        if (result_6 &= isRelatedTo(getFalseTypeFromConditionalType(source), getFalseTypeFromConditionalType(target), false)) {
                                            return result_6;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (flags & 33554432) {
                        return isRelatedTo(source.substitute, target.substitute, false);
                    }
                    return 0;
                }
                var result;
                var originalErrorInfo;
                var varianceCheckFailed = false;
                var saveErrorInfo = captureErrorCalculationState();
                if (source.flags & (524288 | 16777216) && source.aliasSymbol &&
                    source.aliasTypeArguments && source.aliasSymbol === target.aliasSymbol &&
                    !(source.aliasTypeArgumentsContainsMarker || target.aliasTypeArgumentsContainsMarker)) {
                    var variances = getAliasVariances(source.aliasSymbol);
                    if (variances === ts.emptyArray) {
                        return 1;
                    }
                    var varianceResult = relateVariances(source.aliasTypeArguments, target.aliasTypeArguments, variances, intersectionState);
                    if (varianceResult !== undefined) {
                        return varianceResult;
                    }
                }
                if (target.flags & 262144) {
                    if (ts.getObjectFlags(source) & 32 && isRelatedTo(getIndexType(target), getConstraintTypeFromMappedType(source))) {
                        if (!(getMappedTypeModifiers(source) & 4)) {
                            var templateType = getTemplateTypeFromMappedType(source);
                            var indexedAccessType = getIndexedAccessType(target, getTypeParameterFromMappedType(source));
                            if (result = isRelatedTo(templateType, indexedAccessType, reportErrors)) {
                                return result;
                            }
                        }
                    }
                }
                else if (target.flags & 4194304) {
                    if (source.flags & 4194304) {
                        if (result = isRelatedTo(target.type, source.type, false)) {
                            return result;
                        }
                    }
                    var constraint = getSimplifiedTypeOrConstraint(target.type);
                    if (constraint) {
                        if (isRelatedTo(source, getIndexType(constraint, target.stringsOnly), reportErrors) === -1) {
                            return -1;
                        }
                    }
                }
                else if (target.flags & 8388608) {
                    if (relation !== identityRelation) {
                        var objectType = target.objectType;
                        var indexType = target.indexType;
                        var baseObjectType = getBaseConstraintOfType(objectType) || objectType;
                        var baseIndexType = getBaseConstraintOfType(indexType) || indexType;
                        if (!isGenericObjectType(baseObjectType) && !isGenericIndexType(baseIndexType)) {
                            var accessFlags = 2 | (baseObjectType !== objectType ? 1 : 0);
                            var constraint = getIndexedAccessTypeOrUndefined(baseObjectType, baseIndexType, undefined, accessFlags);
                            if (constraint && (result = isRelatedTo(source, constraint, reportErrors))) {
                                return result;
                            }
                        }
                    }
                }
                else if (isGenericMappedType(target)) {
                    var template = getTemplateTypeFromMappedType(target);
                    var modifiers = getMappedTypeModifiers(target);
                    if (!(modifiers & 8)) {
                        if (template.flags & 8388608 && template.objectType === source &&
                            template.indexType === getTypeParameterFromMappedType(target)) {
                            return -1;
                        }
                        if (!isGenericMappedType(source)) {
                            var targetConstraint = getConstraintTypeFromMappedType(target);
                            var sourceKeys = getIndexType(source, undefined, true);
                            var includeOptional = modifiers & 4;
                            var filteredByApplicability = includeOptional ? intersectTypes(targetConstraint, sourceKeys) : undefined;
                            if (includeOptional
                                ? !(filteredByApplicability.flags & 131072)
                                : isRelatedTo(targetConstraint, sourceKeys)) {
                                var typeParameter = getTypeParameterFromMappedType(target);
                                var indexingType = filteredByApplicability ? getIntersectionType([filteredByApplicability, typeParameter]) : typeParameter;
                                var indexedAccessType = getIndexedAccessType(source, indexingType);
                                var templateType = getTemplateTypeFromMappedType(target);
                                if (result = isRelatedTo(indexedAccessType, templateType, reportErrors)) {
                                    return result;
                                }
                            }
                            originalErrorInfo = errorInfo;
                            resetErrorInfo(saveErrorInfo);
                        }
                    }
                }
                if (source.flags & 8650752) {
                    if (source.flags & 8388608 && target.flags & 8388608) {
                        if (result = isRelatedTo(source.objectType, target.objectType, reportErrors)) {
                            result &= isRelatedTo(source.indexType, target.indexType, reportErrors);
                        }
                        if (result) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                    }
                    else {
                        var constraint = getConstraintOfType(source);
                        if (!constraint || (source.flags & 262144 && constraint.flags & 1)) {
                            if (result = isRelatedTo(emptyObjectType, extractTypesOfKind(target, ~67108864))) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                        else if (result = isRelatedTo(constraint, target, false, undefined, intersectionState)) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                        else if (result = isRelatedTo(getTypeWithThisArgument(constraint, source), target, reportErrors, undefined, intersectionState)) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                    }
                }
                else if (source.flags & 4194304) {
                    if (result = isRelatedTo(keyofConstraintType, target, reportErrors)) {
                        resetErrorInfo(saveErrorInfo);
                        return result;
                    }
                }
                else if (source.flags & 16777216) {
                    if (target.flags & 16777216) {
                        var sourceParams = source.root.inferTypeParameters;
                        var sourceExtends = source.extendsType;
                        var mapper = void 0;
                        if (sourceParams) {
                            var ctx = createInferenceContext(sourceParams, undefined, 0, isRelatedTo);
                            inferTypes(ctx.inferences, target.extendsType, sourceExtends, 128 | 256);
                            sourceExtends = instantiateType(sourceExtends, ctx.mapper);
                            mapper = ctx.mapper;
                        }
                        if (isTypeIdenticalTo(sourceExtends, target.extendsType) &&
                            (isRelatedTo(source.checkType, target.checkType) || isRelatedTo(target.checkType, source.checkType))) {
                            if (result = isRelatedTo(instantiateType(getTrueTypeFromConditionalType(source), mapper), getTrueTypeFromConditionalType(target), reportErrors)) {
                                result &= isRelatedTo(getFalseTypeFromConditionalType(source), getFalseTypeFromConditionalType(target), reportErrors);
                            }
                            if (result) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                    }
                    else {
                        var distributiveConstraint = getConstraintOfDistributiveConditionalType(source);
                        if (distributiveConstraint) {
                            if (result = isRelatedTo(distributiveConstraint, target, reportErrors)) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                    }
                    var defaultConstraint = getDefaultConstraintOfConditionalType(source);
                    if (defaultConstraint) {
                        if (result = isRelatedTo(defaultConstraint, target, reportErrors)) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                    }
                }
                else {
                    if (relation !== subtypeRelation && relation !== strictSubtypeRelation && isPartialMappedType(target) && isEmptyObjectType(source)) {
                        return -1;
                    }
                    if (isGenericMappedType(target)) {
                        if (isGenericMappedType(source)) {
                            if (result = mappedTypeRelatedTo(source, target, reportErrors)) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                        return 0;
                    }
                    var sourceIsPrimitive = !!(source.flags & 131068);
                    if (relation !== identityRelation) {
                        source = getApparentType(source);
                    }
                    else if (isGenericMappedType(source)) {
                        return 0;
                    }
                    if (ts.getObjectFlags(source) & 4 && ts.getObjectFlags(target) & 4 && source.target === target.target &&
                        !(ts.getObjectFlags(source) & 8192 || ts.getObjectFlags(target) & 8192)) {
                        var variances = getVariances(source.target);
                        if (variances === ts.emptyArray) {
                            return 1;
                        }
                        var varianceResult = relateVariances(getTypeArguments(source), getTypeArguments(target), variances, intersectionState);
                        if (varianceResult !== undefined) {
                            return varianceResult;
                        }
                    }
                    else if (isReadonlyArrayType(target) ? isArrayType(source) || isTupleType(source) : isArrayType(target) && isTupleType(source) && !source.target.readonly) {
                        if (relation !== identityRelation) {
                            return isRelatedTo(getIndexTypeOfType(source, 1) || anyType, getIndexTypeOfType(target, 1) || anyType, reportErrors);
                        }
                        else {
                            return 0;
                        }
                    }
                    else if ((relation === subtypeRelation || relation === strictSubtypeRelation) && isEmptyObjectType(target) && ts.getObjectFlags(target) & 32768 && !isEmptyObjectType(source)) {
                        return 0;
                    }
                    if (source.flags & (524288 | 2097152) && target.flags & 524288) {
                        var reportStructuralErrors = reportErrors && errorInfo === saveErrorInfo.errorInfo && !sourceIsPrimitive;
                        result = propertiesRelatedTo(source, target, reportStructuralErrors, undefined, intersectionState);
                        if (result) {
                            result &= signaturesRelatedTo(source, target, 0, reportStructuralErrors);
                            if (result) {
                                result &= signaturesRelatedTo(source, target, 1, reportStructuralErrors);
                                if (result) {
                                    result &= indexTypesRelatedTo(source, target, 0, sourceIsPrimitive, reportStructuralErrors, intersectionState);
                                    if (result) {
                                        result &= indexTypesRelatedTo(source, target, 1, sourceIsPrimitive, reportStructuralErrors, intersectionState);
                                    }
                                }
                            }
                        }
                        if (varianceCheckFailed && result) {
                            errorInfo = originalErrorInfo || errorInfo || saveErrorInfo.errorInfo;
                        }
                        else if (result) {
                            return result;
                        }
                    }
                    if (source.flags & (524288 | 2097152) && target.flags & 1048576) {
                        var objectOnlyTarget = extractTypesOfKind(target, 524288 | 2097152 | 33554432);
                        if (objectOnlyTarget.flags & 1048576) {
                            var result_7 = typeRelatedToDiscriminatedType(source, objectOnlyTarget);
                            if (result_7) {
                                return result_7;
                            }
                        }
                    }
                }
                return 0;
                function relateVariances(sourceTypeArguments, targetTypeArguments, variances, intersectionState) {
                    if (result = typeArgumentsRelatedTo(sourceTypeArguments, targetTypeArguments, variances, reportErrors, intersectionState)) {
                        return result;
                    }
                    if (ts.some(variances, function (v) { return !!(v & 24); })) {
                        originalErrorInfo = undefined;
                        resetErrorInfo(saveErrorInfo);
                        return undefined;
                    }
                    var allowStructuralFallback = targetTypeArguments && hasCovariantVoidArgument(targetTypeArguments, variances);
                    varianceCheckFailed = !allowStructuralFallback;
                    if (variances !== ts.emptyArray && !allowStructuralFallback) {
                        if (varianceCheckFailed && !(reportErrors && ts.some(variances, function (v) { return (v & 7) === 0; }))) {
                            return 0;
                        }
                        originalErrorInfo = errorInfo;
                        resetErrorInfo(saveErrorInfo);
                    }
                }
            }
            function reportUnmeasurableMarkers(p) {
                if (outofbandVarianceMarkerHandler && (p === markerSuperType || p === markerSubType || p === markerOtherType)) {
                    outofbandVarianceMarkerHandler(false);
                }
                return p;
            }
            function reportUnreliableMarkers(p) {
                if (outofbandVarianceMarkerHandler && (p === markerSuperType || p === markerSubType || p === markerOtherType)) {
                    outofbandVarianceMarkerHandler(true);
                }
                return p;
            }
            function mappedTypeRelatedTo(source, target, reportErrors) {
                var modifiersRelated = relation === comparableRelation || (relation === identityRelation ? getMappedTypeModifiers(source) === getMappedTypeModifiers(target) :
                    getCombinedMappedTypeOptionality(source) <= getCombinedMappedTypeOptionality(target));
                if (modifiersRelated) {
                    var result_8;
                    var targetConstraint = getConstraintTypeFromMappedType(target);
                    var sourceConstraint = instantiateType(getConstraintTypeFromMappedType(source), makeFunctionTypeMapper(getCombinedMappedTypeOptionality(source) < 0 ? reportUnmeasurableMarkers : reportUnreliableMarkers));
                    if (result_8 = isRelatedTo(targetConstraint, sourceConstraint, reportErrors)) {
                        var mapper = createTypeMapper([getTypeParameterFromMappedType(source)], [getTypeParameterFromMappedType(target)]);
                        return result_8 & isRelatedTo(instantiateType(getTemplateTypeFromMappedType(source), mapper), getTemplateTypeFromMappedType(target), reportErrors);
                    }
                }
                return 0;
            }
            function typeRelatedToDiscriminatedType(source, target) {
                var sourceProperties = getPropertiesOfType(source);
                var sourcePropertiesFiltered = findDiscriminantProperties(sourceProperties, target);
                if (!sourcePropertiesFiltered)
                    return 0;
                var numCombinations = 1;
                for (var _i = 0, sourcePropertiesFiltered_1 = sourcePropertiesFiltered; _i < sourcePropertiesFiltered_1.length; _i++) {
                    var sourceProperty = sourcePropertiesFiltered_1[_i];
                    numCombinations *= countTypes(getTypeOfSymbol(sourceProperty));
                    if (numCombinations > 25) {
                        return 0;
                    }
                }
                var sourceDiscriminantTypes = new Array(sourcePropertiesFiltered.length);
                var excludedProperties = ts.createUnderscoreEscapedMap();
                for (var i = 0; i < sourcePropertiesFiltered.length; i++) {
                    var sourceProperty = sourcePropertiesFiltered[i];
                    var sourcePropertyType = getTypeOfSymbol(sourceProperty);
                    sourceDiscriminantTypes[i] = sourcePropertyType.flags & 1048576
                        ? sourcePropertyType.types
                        : [sourcePropertyType];
                    excludedProperties.set(sourceProperty.escapedName, true);
                }
                var discriminantCombinations = ts.cartesianProduct(sourceDiscriminantTypes);
                var matchingTypes = [];
                var _loop_14 = function (combination) {
                    var hasMatch = false;
                    outer: for (var _i = 0, _a = target.types; _i < _a.length; _i++) {
                        var type = _a[_i];
                        var _loop_15 = function (i) {
                            var sourceProperty = sourcePropertiesFiltered[i];
                            var targetProperty = getPropertyOfType(type, sourceProperty.escapedName);
                            if (!targetProperty)
                                return "continue-outer";
                            if (sourceProperty === targetProperty)
                                return "continue";
                            var related = propertyRelatedTo(source, target, sourceProperty, targetProperty, function (_) { return combination[i]; }, false, 0, strictNullChecks || relation === comparableRelation);
                            if (!related) {
                                return "continue-outer";
                            }
                        };
                        for (var i = 0; i < sourcePropertiesFiltered.length; i++) {
                            var state_7 = _loop_15(i);
                            switch (state_7) {
                                case "continue-outer": continue outer;
                            }
                        }
                        ts.pushIfUnique(matchingTypes, type, ts.equateValues);
                        hasMatch = true;
                    }
                    if (!hasMatch) {
                        return { value: 0 };
                    }
                };
                for (var _a = 0, discriminantCombinations_1 = discriminantCombinations; _a < discriminantCombinations_1.length; _a++) {
                    var combination = discriminantCombinations_1[_a];
                    var state_6 = _loop_14(combination);
                    if (typeof state_6 === "object")
                        return state_6.value;
                }
                var result = -1;
                for (var _b = 0, matchingTypes_1 = matchingTypes; _b < matchingTypes_1.length; _b++) {
                    var type = matchingTypes_1[_b];
                    result &= propertiesRelatedTo(source, type, false, excludedProperties, 0);
                    if (result) {
                        result &= signaturesRelatedTo(source, type, 0, false);
                        if (result) {
                            result &= signaturesRelatedTo(source, type, 1, false);
                            if (result) {
                                result &= indexTypesRelatedTo(source, type, 0, false, false, 0);
                                if (result) {
                                    result &= indexTypesRelatedTo(source, type, 1, false, false, 0);
                                }
                            }
                        }
                    }
                    if (!result) {
                        return result;
                    }
                }
                return result;
            }
            function excludeProperties(properties, excludedProperties) {
                if (!excludedProperties || properties.length === 0)
                    return properties;
                var result;
                for (var i = 0; i < properties.length; i++) {
                    if (!excludedProperties.has(properties[i].escapedName)) {
                        if (result) {
                            result.push(properties[i]);
                        }
                    }
                    else if (!result) {
                        result = properties.slice(0, i);
                    }
                }
                return result || properties;
            }
            function isPropertySymbolTypeRelated(sourceProp, targetProp, getTypeOfSourceProperty, reportErrors, intersectionState) {
                var targetIsOptional = strictNullChecks && !!(ts.getCheckFlags(targetProp) & 48);
                var source = getTypeOfSourceProperty(sourceProp);
                if (ts.getCheckFlags(targetProp) & 65536 && !getSymbolLinks(targetProp).type) {
                    var links = getSymbolLinks(targetProp);
                    ts.Debug.assertIsDefined(links.deferralParent);
                    ts.Debug.assertIsDefined(links.deferralConstituents);
                    var unionParent = !!(links.deferralParent.flags & 1048576);
                    var result_9 = unionParent ? 0 : -1;
                    var targetTypes = links.deferralConstituents;
                    for (var _i = 0, targetTypes_3 = targetTypes; _i < targetTypes_3.length; _i++) {
                        var targetType = targetTypes_3[_i];
                        var related = isRelatedTo(source, targetType, false, undefined, unionParent ? 0 : 2);
                        if (!unionParent) {
                            if (!related) {
                                return isRelatedTo(source, addOptionality(getTypeOfSymbol(targetProp), targetIsOptional), reportErrors);
                            }
                            result_9 &= related;
                        }
                        else {
                            if (related) {
                                return related;
                            }
                        }
                    }
                    if (unionParent && !result_9 && targetIsOptional) {
                        result_9 = isRelatedTo(source, undefinedType);
                    }
                    if (unionParent && !result_9 && reportErrors) {
                        return isRelatedTo(source, addOptionality(getTypeOfSymbol(targetProp), targetIsOptional), reportErrors);
                    }
                    return result_9;
                }
                else {
                    return isRelatedTo(source, addOptionality(getTypeOfSymbol(targetProp), targetIsOptional), reportErrors, undefined, intersectionState);
                }
            }
            function propertyRelatedTo(source, target, sourceProp, targetProp, getTypeOfSourceProperty, reportErrors, intersectionState, skipOptional) {
                var sourcePropFlags = ts.getDeclarationModifierFlagsFromSymbol(sourceProp);
                var targetPropFlags = ts.getDeclarationModifierFlagsFromSymbol(targetProp);
                if (sourcePropFlags & 8 || targetPropFlags & 8) {
                    if (sourceProp.valueDeclaration !== targetProp.valueDeclaration) {
                        if (reportErrors) {
                            if (sourcePropFlags & 8 && targetPropFlags & 8) {
                                reportError(ts.Diagnostics.Types_have_separate_declarations_of_a_private_property_0, symbolToString(targetProp));
                            }
                            else {
                                reportError(ts.Diagnostics.Property_0_is_private_in_type_1_but_not_in_type_2, symbolToString(targetProp), typeToString(sourcePropFlags & 8 ? source : target), typeToString(sourcePropFlags & 8 ? target : source));
                            }
                        }
                        return 0;
                    }
                }
                else if (targetPropFlags & 16) {
                    if (!isValidOverrideOf(sourceProp, targetProp)) {
                        if (reportErrors) {
                            reportError(ts.Diagnostics.Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2, symbolToString(targetProp), typeToString(getDeclaringClass(sourceProp) || source), typeToString(getDeclaringClass(targetProp) || target));
                        }
                        return 0;
                    }
                }
                else if (sourcePropFlags & 16) {
                    if (reportErrors) {
                        reportError(ts.Diagnostics.Property_0_is_protected_in_type_1_but_public_in_type_2, symbolToString(targetProp), typeToString(source), typeToString(target));
                    }
                    return 0;
                }
                var related = isPropertySymbolTypeRelated(sourceProp, targetProp, getTypeOfSourceProperty, reportErrors, intersectionState);
                if (!related) {
                    if (reportErrors) {
                        reportIncompatibleError(ts.Diagnostics.Types_of_property_0_are_incompatible, symbolToString(targetProp));
                    }
                    return 0;
                }
                if (!skipOptional && sourceProp.flags & 16777216 && !(targetProp.flags & 16777216)) {
                    if (reportErrors) {
                        reportError(ts.Diagnostics.Property_0_is_optional_in_type_1_but_required_in_type_2, symbolToString(targetProp), typeToString(source), typeToString(target));
                    }
                    return 0;
                }
                return related;
            }
            function reportUnmatchedProperty(source, target, unmatchedProperty, requireOptionalProperties) {
                var shouldSkipElaboration = false;
                if (unmatchedProperty.valueDeclaration
                    && ts.isNamedDeclaration(unmatchedProperty.valueDeclaration)
                    && ts.isPrivateIdentifier(unmatchedProperty.valueDeclaration.name)
                    && source.symbol
                    && source.symbol.flags & 32) {
                    var privateIdentifierDescription = unmatchedProperty.valueDeclaration.name.escapedText;
                    var symbolTableKey = ts.getSymbolNameForPrivateIdentifier(source.symbol, privateIdentifierDescription);
                    if (symbolTableKey && getPropertyOfType(source, symbolTableKey)) {
                        var sourceName = ts.getDeclarationName(source.symbol.valueDeclaration);
                        var targetName = ts.getDeclarationName(target.symbol.valueDeclaration);
                        reportError(ts.Diagnostics.Property_0_in_type_1_refers_to_a_different_member_that_cannot_be_accessed_from_within_type_2, diagnosticName(privateIdentifierDescription), diagnosticName(sourceName.escapedText === "" ? anon : sourceName), diagnosticName(targetName.escapedText === "" ? anon : targetName));
                        return;
                    }
                }
                var props = ts.arrayFrom(getUnmatchedProperties(source, target, requireOptionalProperties, false));
                if (!headMessage || (headMessage.code !== ts.Diagnostics.Class_0_incorrectly_implements_interface_1.code &&
                    headMessage.code !== ts.Diagnostics.Class_0_incorrectly_implements_class_1_Did_you_mean_to_extend_1_and_inherit_its_members_as_a_subclass.code)) {
                    shouldSkipElaboration = true;
                }
                if (props.length === 1) {
                    var propName = symbolToString(unmatchedProperty);
                    reportError.apply(void 0, __spreadArrays([ts.Diagnostics.Property_0_is_missing_in_type_1_but_required_in_type_2, propName], getTypeNamesForErrorDisplay(source, target)));
                    if (ts.length(unmatchedProperty.declarations)) {
                        associateRelatedInfo(ts.createDiagnosticForNode(unmatchedProperty.declarations[0], ts.Diagnostics._0_is_declared_here, propName));
                    }
                    if (shouldSkipElaboration && errorInfo) {
                        overrideNextErrorInfo++;
                    }
                }
                else if (tryElaborateArrayLikeErrors(source, target, false)) {
                    if (props.length > 5) {
                        reportError(ts.Diagnostics.Type_0_is_missing_the_following_properties_from_type_1_Colon_2_and_3_more, typeToString(source), typeToString(target), ts.map(props.slice(0, 4), function (p) { return symbolToString(p); }).join(", "), props.length - 4);
                    }
                    else {
                        reportError(ts.Diagnostics.Type_0_is_missing_the_following_properties_from_type_1_Colon_2, typeToString(source), typeToString(target), ts.map(props, function (p) { return symbolToString(p); }).join(", "));
                    }
                    if (shouldSkipElaboration && errorInfo) {
                        overrideNextErrorInfo++;
                    }
                }
            }
            function propertiesRelatedTo(source, target, reportErrors, excludedProperties, intersectionState) {
                if (relation === identityRelation) {
                    return propertiesIdenticalTo(source, target, excludedProperties);
                }
                var requireOptionalProperties = (relation === subtypeRelation || relation === strictSubtypeRelation) && !isObjectLiteralType(source) && !isEmptyArrayLiteralType(source) && !isTupleType(source);
                var unmatchedProperty = getUnmatchedProperty(source, target, requireOptionalProperties, false);
                if (unmatchedProperty) {
                    if (reportErrors) {
                        reportUnmatchedProperty(source, target, unmatchedProperty, requireOptionalProperties);
                    }
                    return 0;
                }
                if (isObjectLiteralType(target)) {
                    for (var _i = 0, _a = excludeProperties(getPropertiesOfType(source), excludedProperties); _i < _a.length; _i++) {
                        var sourceProp = _a[_i];
                        if (!getPropertyOfObjectType(target, sourceProp.escapedName)) {
                            var sourceType = getTypeOfSymbol(sourceProp);
                            if (!(sourceType === undefinedType || sourceType === undefinedWideningType || sourceType === optionalType)) {
                                if (reportErrors) {
                                    reportError(ts.Diagnostics.Property_0_does_not_exist_on_type_1, symbolToString(sourceProp), typeToString(target));
                                }
                                return 0;
                            }
                        }
                    }
                }
                var result = -1;
                if (isTupleType(target)) {
                    var targetRestType = getRestTypeOfTupleType(target);
                    if (targetRestType) {
                        if (!isTupleType(source)) {
                            return 0;
                        }
                        var sourceRestType = getRestTypeOfTupleType(source);
                        if (sourceRestType && !isRelatedTo(sourceRestType, targetRestType, reportErrors)) {
                            if (reportErrors) {
                                reportError(ts.Diagnostics.Rest_signatures_are_incompatible);
                            }
                            return 0;
                        }
                        var targetCount = getTypeReferenceArity(target) - 1;
                        var sourceCount = getTypeReferenceArity(source) - (sourceRestType ? 1 : 0);
                        var sourceTypeArguments = getTypeArguments(source);
                        for (var i = targetCount; i < sourceCount; i++) {
                            var related = isRelatedTo(sourceTypeArguments[i], targetRestType, reportErrors);
                            if (!related) {
                                if (reportErrors) {
                                    reportError(ts.Diagnostics.Property_0_is_incompatible_with_rest_element_type, "" + i);
                                }
                                return 0;
                            }
                            result &= related;
                        }
                    }
                }
                var properties = getPropertiesOfType(target);
                var numericNamesOnly = isTupleType(source) && isTupleType(target);
                for (var _b = 0, _c = excludeProperties(properties, excludedProperties); _b < _c.length; _b++) {
                    var targetProp = _c[_b];
                    var name = targetProp.escapedName;
                    if (!(targetProp.flags & 4194304) && (!numericNamesOnly || isNumericLiteralName(name) || name === "length")) {
                        var sourceProp = getPropertyOfType(source, name);
                        if (sourceProp && sourceProp !== targetProp) {
                            var related = propertyRelatedTo(source, target, sourceProp, targetProp, getTypeOfSymbol, reportErrors, intersectionState, relation === comparableRelation);
                            if (!related) {
                                return 0;
                            }
                            result &= related;
                        }
                    }
                }
                return result;
            }
            function propertiesIdenticalTo(source, target, excludedProperties) {
                if (!(source.flags & 524288 && target.flags & 524288)) {
                    return 0;
                }
                var sourceProperties = excludeProperties(getPropertiesOfObjectType(source), excludedProperties);
                var targetProperties = excludeProperties(getPropertiesOfObjectType(target), excludedProperties);
                if (sourceProperties.length !== targetProperties.length) {
                    return 0;
                }
                var result = -1;
                for (var _i = 0, sourceProperties_1 = sourceProperties; _i < sourceProperties_1.length; _i++) {
                    var sourceProp = sourceProperties_1[_i];
                    var targetProp = getPropertyOfObjectType(target, sourceProp.escapedName);
                    if (!targetProp) {
                        return 0;
                    }
                    var related = compareProperties(sourceProp, targetProp, isRelatedTo);
                    if (!related) {
                        return 0;
                    }
                    result &= related;
                }
                return result;
            }
            function signaturesRelatedTo(source, target, kind, reportErrors) {
                if (relation === identityRelation) {
                    return signaturesIdenticalTo(source, target, kind);
                }
                if (target === anyFunctionType || source === anyFunctionType) {
                    return -1;
                }
                var sourceIsJSConstructor = source.symbol && isJSConstructor(source.symbol.valueDeclaration);
                var targetIsJSConstructor = target.symbol && isJSConstructor(target.symbol.valueDeclaration);
                var sourceSignatures = getSignaturesOfType(source, (sourceIsJSConstructor && kind === 1) ?
                    0 : kind);
                var targetSignatures = getSignaturesOfType(target, (targetIsJSConstructor && kind === 1) ?
                    0 : kind);
                if (kind === 1 && sourceSignatures.length && targetSignatures.length) {
                    if (ts.isAbstractConstructorType(source) && !ts.isAbstractConstructorType(target)) {
                        if (reportErrors) {
                            reportError(ts.Diagnostics.Cannot_assign_an_abstract_constructor_type_to_a_non_abstract_constructor_type);
                        }
                        return 0;
                    }
                    if (!constructorVisibilitiesAreCompatible(sourceSignatures[0], targetSignatures[0], reportErrors)) {
                        return 0;
                    }
                }
                var result = -1;
                var saveErrorInfo = captureErrorCalculationState();
                var incompatibleReporter = kind === 1 ? reportIncompatibleConstructSignatureReturn : reportIncompatibleCallSignatureReturn;
                if (ts.getObjectFlags(source) & 64 && ts.getObjectFlags(target) & 64 && source.symbol === target.symbol) {
                    for (var i = 0; i < targetSignatures.length; i++) {
                        var related = signatureRelatedTo(sourceSignatures[i], targetSignatures[i], true, reportErrors, incompatibleReporter(sourceSignatures[i], targetSignatures[i]));
                        if (!related) {
                            return 0;
                        }
                        result &= related;
                    }
                }
                else if (sourceSignatures.length === 1 && targetSignatures.length === 1) {
                    var eraseGenerics = relation === comparableRelation || !!compilerOptions.noStrictGenericChecks;
                    result = signatureRelatedTo(sourceSignatures[0], targetSignatures[0], eraseGenerics, reportErrors, incompatibleReporter(sourceSignatures[0], targetSignatures[0]));
                }
                else {
                    outer: for (var _i = 0, targetSignatures_1 = targetSignatures; _i < targetSignatures_1.length; _i++) {
                        var t = targetSignatures_1[_i];
                        var shouldElaborateErrors = reportErrors;
                        for (var _a = 0, sourceSignatures_1 = sourceSignatures; _a < sourceSignatures_1.length; _a++) {
                            var s = sourceSignatures_1[_a];
                            var related = signatureRelatedTo(s, t, true, shouldElaborateErrors, incompatibleReporter(s, t));
                            if (related) {
                                result &= related;
                                resetErrorInfo(saveErrorInfo);
                                continue outer;
                            }
                            shouldElaborateErrors = false;
                        }
                        if (shouldElaborateErrors) {
                            reportError(ts.Diagnostics.Type_0_provides_no_match_for_the_signature_1, typeToString(source), signatureToString(t, undefined, undefined, kind));
                        }
                        return 0;
                    }
                }
                return result;
            }
            function reportIncompatibleCallSignatureReturn(siga, sigb) {
                if (siga.parameters.length === 0 && sigb.parameters.length === 0) {
                    return function (source, target) { return reportIncompatibleError(ts.Diagnostics.Call_signatures_with_no_arguments_have_incompatible_return_types_0_and_1, typeToString(source), typeToString(target)); };
                }
                return function (source, target) { return reportIncompatibleError(ts.Diagnostics.Call_signature_return_types_0_and_1_are_incompatible, typeToString(source), typeToString(target)); };
            }
            function reportIncompatibleConstructSignatureReturn(siga, sigb) {
                if (siga.parameters.length === 0 && sigb.parameters.length === 0) {
                    return function (source, target) { return reportIncompatibleError(ts.Diagnostics.Construct_signatures_with_no_arguments_have_incompatible_return_types_0_and_1, typeToString(source), typeToString(target)); };
                }
                return function (source, target) { return reportIncompatibleError(ts.Diagnostics.Construct_signature_return_types_0_and_1_are_incompatible, typeToString(source), typeToString(target)); };
            }
            function signatureRelatedTo(source, target, erase, reportErrors, incompatibleReporter) {
                return compareSignaturesRelated(erase ? getErasedSignature(source) : source, erase ? getErasedSignature(target) : target, relation === strictSubtypeRelation ? 8 : 0, reportErrors, reportError, incompatibleReporter, isRelatedTo, makeFunctionTypeMapper(reportUnreliableMarkers));
            }
            function signaturesIdenticalTo(source, target, kind) {
                var sourceSignatures = getSignaturesOfType(source, kind);
                var targetSignatures = getSignaturesOfType(target, kind);
                if (sourceSignatures.length !== targetSignatures.length) {
                    return 0;
                }
                var result = -1;
                for (var i = 0; i < sourceSignatures.length; i++) {
                    var related = compareSignaturesIdentical(sourceSignatures[i], targetSignatures[i], false, false, false, isRelatedTo);
                    if (!related) {
                        return 0;
                    }
                    result &= related;
                }
                return result;
            }
            function eachPropertyRelatedTo(source, target, kind, reportErrors) {
                var result = -1;
                var props = source.flags & 2097152 ? getPropertiesOfUnionOrIntersectionType(source) : getPropertiesOfObjectType(source);
                for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
                    var prop = props_2[_i];
                    if (isIgnoredJsxProperty(source, prop)) {
                        continue;
                    }
                    var nameType = getSymbolLinks(prop).nameType;
                    if (nameType && nameType.flags & 8192) {
                        continue;
                    }
                    if (kind === 0 || isNumericLiteralName(prop.escapedName)) {
                        var related = isRelatedTo(getTypeOfSymbol(prop), target, reportErrors);
                        if (!related) {
                            if (reportErrors) {
                                reportError(ts.Diagnostics.Property_0_is_incompatible_with_index_signature, symbolToString(prop));
                            }
                            return 0;
                        }
                        result &= related;
                    }
                }
                return result;
            }
            function indexTypeRelatedTo(sourceType, targetType, reportErrors) {
                var related = isRelatedTo(sourceType, targetType, reportErrors);
                if (!related && reportErrors) {
                    reportError(ts.Diagnostics.Index_signatures_are_incompatible);
                }
                return related;
            }
            function indexTypesRelatedTo(source, target, kind, sourceIsPrimitive, reportErrors, intersectionState) {
                if (relation === identityRelation) {
                    return indexTypesIdenticalTo(source, target, kind);
                }
                var targetType = getIndexTypeOfType(target, kind);
                if (!targetType || targetType.flags & 1 && !sourceIsPrimitive) {
                    return -1;
                }
                if (isGenericMappedType(source)) {
                    return kind === 0 ? isRelatedTo(getTemplateTypeFromMappedType(source), targetType, reportErrors) : 0;
                }
                var indexType = getIndexTypeOfType(source, kind) || kind === 1 && getIndexTypeOfType(source, 0);
                if (indexType) {
                    return indexTypeRelatedTo(indexType, targetType, reportErrors);
                }
                if (!(intersectionState & 1) && isObjectTypeWithInferableIndex(source)) {
                    var related = eachPropertyRelatedTo(source, targetType, kind, reportErrors);
                    if (related && kind === 0) {
                        var numberIndexType = getIndexTypeOfType(source, 1);
                        if (numberIndexType) {
                            related &= indexTypeRelatedTo(numberIndexType, targetType, reportErrors);
                        }
                    }
                    return related;
                }
                if (reportErrors) {
                    reportError(ts.Diagnostics.Index_signature_is_missing_in_type_0, typeToString(source));
                }
                return 0;
            }
            function indexTypesIdenticalTo(source, target, indexKind) {
                var targetInfo = getIndexInfoOfType(target, indexKind);
                var sourceInfo = getIndexInfoOfType(source, indexKind);
                if (!sourceInfo && !targetInfo) {
                    return -1;
                }
                if (sourceInfo && targetInfo && sourceInfo.isReadonly === targetInfo.isReadonly) {
                    return isRelatedTo(sourceInfo.type, targetInfo.type);
                }
                return 0;
            }
            function constructorVisibilitiesAreCompatible(sourceSignature, targetSignature, reportErrors) {
                if (!sourceSignature.declaration || !targetSignature.declaration) {
                    return true;
                }
                var sourceAccessibility = ts.getSelectedModifierFlags(sourceSignature.declaration, 24);
                var targetAccessibility = ts.getSelectedModifierFlags(targetSignature.declaration, 24);
                if (targetAccessibility === 8) {
                    return true;
                }
                if (targetAccessibility === 16 && sourceAccessibility !== 8) {
                    return true;
                }
                if (targetAccessibility !== 16 && !sourceAccessibility) {
                    return true;
                }
                if (reportErrors) {
                    reportError(ts.Diagnostics.Cannot_assign_a_0_constructor_type_to_a_1_constructor_type, visibilityToString(sourceAccessibility), visibilityToString(targetAccessibility));
                }
                return false;
            }
        }
