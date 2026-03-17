        function checkTypeRelatedTo(source, target, relation, errorNode, headMessage, containingMessageChain, errorOutputContainer) {
            var errorInfo;
            var relatedInfo;
            var maybeKeys;
            var sourceStack;
            var targetStack;
            var maybeCount = 0;
            var depth = 0;
            var expandingFlags = 0 /* None */;
            var overflow = false;
            var overrideNextErrorInfo = 0; // How many `reportRelationError` calls should be skipped in the elaboration pyramid
            var lastSkippedInfo;
            var incompatibleStack = [];
            var inPropertyCheck = false;
            ts.Debug.assert(relation !== identityRelation || !errorNode, "no error reporting in identity checking");
            var result = isRelatedTo(source, target, /*reportErrors*/ !!errorNode, headMessage);
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
                // Check if we should issue an extra diagnostic to produce a quickfix for a slightly incorrect import statement
                if (headMessage && errorNode && !result && source.symbol) {
                    var links = getSymbolLinks(source.symbol);
                    if (links.originatingImport && !ts.isImportCall(links.originatingImport)) {
                        var helpfulRetry = checkTypeRelatedTo(getTypeOfSymbol(links.target), target, relation, /*errorNode*/ undefined);
                        if (helpfulRetry) {
                            // Likely an incorrect import. Issue a helpful diagnostic to produce a quickfix to change the import
                            var diag_1 = ts.createDiagnosticForNode(links.originatingImport, ts.Diagnostics.Type_originates_at_this_import_A_namespace_style_import_cannot_be_called_or_constructed_and_will_cause_a_failure_at_runtime_Consider_using_a_default_import_or_import_require_here_instead);
                            relatedInformation = ts.append(relatedInformation, diag_1); // Cause the error to appear with the error that triggered it
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
            if (errorNode && errorOutputContainer && errorOutputContainer.skipLogging && result === 0 /* False */) {
                ts.Debug.assert(!!errorOutputContainer.errors, "missed opportunity to interact with error.");
            }
            return result !== 0 /* False */;
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
                overrideNextErrorInfo++; // Suppress the next relation error
                lastSkippedInfo = undefined; // Reset skipped info cache
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
                        // Actually do the last relation error
                        reportRelationError.apply(void 0, __spreadArrays([/*headMessage*/ undefined], info));
                    }
                    return;
                }
                // The first error will be the innermost, while the last will be the outermost - so by popping off the end,
                // we can build from left to right
                var path = "";
                var secondaryRootErrors = [];
                while (stack.length) {
                    var _a = stack.pop(), msg = _a[0], args = _a.slice(1);
                    switch (msg.code) {
                        case ts.Diagnostics.Types_of_property_0_are_incompatible.code: {
                            // Parenthesize a `new` if there is one
                            if (path.indexOf("new ") === 0) {
                                path = "(" + path + ")";
                            }
                            var str = "" + args[0];
                            // If leading, just print back the arg (irrespective of if it's a valid identifier)
                            if (path.length === 0) {
                                path = "" + str;
                            }
                            // Otherwise write a dotted name if possible
                            else if (ts.isIdentifierText(str, compilerOptions.target)) {
                                path = path + "." + str;
                            }
                            // Failing that, check if the name is already a computed name
                            else if (str[0] === "[" && str[str.length - 1] === "]") {
                                path = "" + path + str;
                            }
                            // And finally write out a computed name as a last resort
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
                                // Don't flatten signature compatability errors at the start of a chain - instead prefer
                                // to unify (the with no arguments bit is excessive for printback) and print them back
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
                    // Remove the innermost secondary error as it will duplicate the error already reported by `reportRelationError` on entry
                    secondaryRootErrors.shift();
                }
                for (var _i = 0, secondaryRootErrors_1 = secondaryRootErrors; _i < secondaryRootErrors_1.length; _i++) {
                    var _b = secondaryRootErrors_1[_i], msg = _b[0], args = _b.slice(1);
                    var originalValue = msg.elidedInCompatabilityPyramid;
                    msg.elidedInCompatabilityPyramid = false; // Teporarily override elision to ensure error is reported
                    reportError.apply(void 0, __spreadArrays([msg], args));
                    msg.elidedInCompatabilityPyramid = originalValue;
                }
                if (info) {
                    // Actually do the last relation error
                    reportRelationError.apply(void 0, __spreadArrays([/*headMessage*/ undefined], info));
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
                if (target.flags & 262144 /* TypeParameter */) {
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
                    (getGlobalESSymbolType(/*reportErrors*/ false) === source && esSymbolType === target)) {
                    reportError(ts.Diagnostics._0_is_a_primitive_but_1_is_a_wrapper_object_Prefer_using_0_when_possible, targetType, sourceType);
                }
            }
            /**
             * Try and elaborate array and tuple errors. Returns false
             * if we have found an elaboration, or we should ignore
             * any other elaborations when relating the `source` and
             * `target` types.
             */
            function tryElaborateArrayLikeErrors(source, target, reportErrors) {
                /**
                 * The spec for elaboration is:
                 * - If the source is a readonly tuple and the target is a mutable array or tuple, elaborate on mutability and skip property elaborations.
                 * - If the source is a tuple then skip property elaborations if the target is an array or tuple.
                 * - If the source is a readonly array and the target is a mutable array or tuple, elaborate on mutability and skip property elaborations.
                 * - If the source an array then skip property elaborations if the target is a tuple.
                 */
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
            /**
             * Compare two types and return
             * * Ternary.True if they are related with no assumptions,
             * * Ternary.Maybe if they are related with assumptions of other relationships, or
             * * Ternary.False if they are not related.
             */
            function isRelatedTo(originalSource, originalTarget, reportErrors, headMessage, intersectionState) {
                if (reportErrors === void 0) { reportErrors = false; }
                if (intersectionState === void 0) { intersectionState = 0 /* None */; }
                // Before normalization: if `source` is type an object type, and `target` is primitive,
                // skip all the checks we don't need and just return `isSimpleTypeRelatedTo` result
                if (originalSource.flags & 524288 /* Object */ && originalTarget.flags & 131068 /* Primitive */) {
                    if (isSimpleTypeRelatedTo(originalSource, originalTarget, relation, reportErrors ? reportError : undefined)) {
                        return -1 /* True */;
                    }
                    reportErrorResults(originalSource, originalTarget, 0 /* False */, !!(ts.getObjectFlags(originalSource) & 4096 /* JsxAttributes */));
                    return 0 /* False */;
                }
                // Normalize the source and target types: Turn fresh literal types into regular literal types,
                // turn deferred type references into regular type references, simplify indexed access and
                // conditional types, and resolve substitution types to either the substitution (on the source
                // side) or the type variable (on the target side).
                var source = getNormalizedType(originalSource, /*writing*/ false);
                var target = getNormalizedType(originalTarget, /*writing*/ true);
                if (source === target)
                    return -1 /* True */;
                if (relation === identityRelation) {
                    return isIdenticalTo(source, target);
                }
                // We fastpath comparing a type parameter to exactly its constraint, as this is _super_ common,
                // and otherwise, for type parameters in large unions, causes us to need to compare the union to itself,
                // as we break down the _target_ union first, _then_ get the source constraint - so for every
                // member of the target, we attempt to find a match in the source. This avoids that in cases where
                // the target is exactly the constraint.
                if (source.flags & 262144 /* TypeParameter */ && getConstraintOfType(source) === target) {
                    return -1 /* True */;
                }
                // Try to see if we're relating something like `Foo` -> `Bar | null | undefined`.
                // If so, reporting the `null` and `undefined` in the type is hardly useful.
                // First, see if we're even relating an object type to a union.
                // Then see if the target is stripped down to a single non-union type.
                // Note
                //  * We actually want to remove null and undefined naively here (rather than using getNonNullableType),
                //    since we don't want to end up with a worse error like "`Foo` is not assignable to `NonNullable<T>`"
                //    when dealing with generics.
                //  * We also don't deal with primitive source types, since we already halt elaboration below.
                if (target.flags & 1048576 /* Union */ && source.flags & 524288 /* Object */ &&
                    target.types.length <= 3 && maybeTypeOfKind(target, 98304 /* Nullable */)) {
                    var nullStrippedTarget = extractTypesOfKind(target, ~98304 /* Nullable */);
                    if (!(nullStrippedTarget.flags & (1048576 /* Union */ | 131072 /* Never */))) {
                        if (source === nullStrippedTarget)
                            return -1 /* True */;
                        target = nullStrippedTarget;
                    }
                }
                if (relation === comparableRelation && !(target.flags & 131072 /* Never */) && isSimpleTypeRelatedTo(target, source, relation) ||
                    isSimpleTypeRelatedTo(source, target, relation, reportErrors ? reportError : undefined))
                    return -1 /* True */;
                var isComparingJsxAttributes = !!(ts.getObjectFlags(source) & 4096 /* JsxAttributes */);
                var isPerformingExcessPropertyChecks = !(intersectionState & 2 /* Target */) && (isObjectLiteralType(source) && ts.getObjectFlags(source) & 32768 /* FreshLiteral */);
                if (isPerformingExcessPropertyChecks) {
                    if (hasExcessProperties(source, target, reportErrors)) {
                        if (reportErrors) {
                            reportRelationError(headMessage, source, target);
                        }
                        return 0 /* False */;
                    }
                }
                var isPerformingCommonPropertyChecks = relation !== comparableRelation && !(intersectionState & 2 /* Target */) &&
                    source.flags & (131068 /* Primitive */ | 524288 /* Object */ | 2097152 /* Intersection */) && source !== globalObjectType &&
                    target.flags & (524288 /* Object */ | 2097152 /* Intersection */) && isWeakType(target) &&
                    (getPropertiesOfType(source).length > 0 || typeHasCallOrConstructSignatures(source));
                if (isPerformingCommonPropertyChecks && !hasCommonProperties(source, target, isComparingJsxAttributes)) {
                    if (reportErrors) {
                        var calls = getSignaturesOfType(source, 0 /* Call */);
                        var constructs = getSignaturesOfType(source, 1 /* Construct */);
                        if (calls.length > 0 && isRelatedTo(getReturnTypeOfSignature(calls[0]), target, /*reportErrors*/ false) ||
                            constructs.length > 0 && isRelatedTo(getReturnTypeOfSignature(constructs[0]), target, /*reportErrors*/ false)) {
                            reportError(ts.Diagnostics.Value_of_type_0_has_no_properties_in_common_with_type_1_Did_you_mean_to_call_it, typeToString(source), typeToString(target));
                        }
                        else {
                            reportError(ts.Diagnostics.Type_0_has_no_properties_in_common_with_type_1, typeToString(source), typeToString(target));
                        }
                    }
                    return 0 /* False */;
                }
                var result = 0 /* False */;
                var saveErrorInfo = captureErrorCalculationState();
                // Note that these checks are specifically ordered to produce correct results. In particular,
                // we need to deconstruct unions before intersections (because unions are always at the top),
                // and we need to handle "each" relations before "some" relations for the same kind of type.
                if (source.flags & 1048576 /* Union */) {
                    result = relation === comparableRelation ?
                        someTypeRelatedToType(source, target, reportErrors && !(source.flags & 131068 /* Primitive */), intersectionState) :
                        eachTypeRelatedToType(source, target, reportErrors && !(source.flags & 131068 /* Primitive */), intersectionState);
                }
                else {
                    if (target.flags & 1048576 /* Union */) {
                        result = typeRelatedToSomeType(getRegularTypeOfObjectLiteral(source), target, reportErrors && !(source.flags & 131068 /* Primitive */) && !(target.flags & 131068 /* Primitive */));
                    }
                    else if (target.flags & 2097152 /* Intersection */) {
                        result = typeRelatedToEachType(getRegularTypeOfObjectLiteral(source), target, reportErrors, 2 /* Target */);
                    }
                    else if (source.flags & 2097152 /* Intersection */) {
                        // Check to see if any constituents of the intersection are immediately related to the target.
                        //
                        // Don't report errors though. Checking whether a constituent is related to the source is not actually
                        // useful and leads to some confusing error messages. Instead it is better to let the below checks
                        // take care of this, or to not elaborate at all. For instance,
                        //
                        //    - For an object type (such as 'C = A & B'), users are usually more interested in structural errors.
                        //
                        //    - For a union type (such as '(A | B) = (C & D)'), it's better to hold onto the whole intersection
                        //          than to report that 'D' is not assignable to 'A' or 'B'.
                        //
                        //    - For a primitive type or type parameter (such as 'number = A & B') there is no point in
                        //          breaking the intersection apart.
                        result = someTypeRelatedToType(source, target, /*reportErrors*/ false, 1 /* Source */);
                    }
                    if (!result && (source.flags & 66846720 /* StructuredOrInstantiable */ || target.flags & 66846720 /* StructuredOrInstantiable */)) {
                        if (result = recursiveTypeRelatedTo(source, target, reportErrors, intersectionState)) {
                            resetErrorInfo(saveErrorInfo);
                        }
                    }
                }
                if (!result && source.flags & (2097152 /* Intersection */ | 262144 /* TypeParameter */)) {
                    // The combined constraint of an intersection type is the intersection of the constraints of
                    // the constituents. When an intersection type contains instantiable types with union type
                    // constraints, there are situations where we need to examine the combined constraint. One is
                    // when the target is a union type. Another is when the intersection contains types belonging
                    // to one of the disjoint domains. For example, given type variables T and U, each with the
                    // constraint 'string | number', the combined constraint of 'T & U' is 'string | number' and
                    // we need to check this constraint against a union on the target side. Also, given a type
                    // variable V constrained to 'string | number', 'V & number' has a combined constraint of
                    // 'string & number | number & number' which reduces to just 'number'.
                    // This also handles type parameters, as a type parameter with a union constraint compared against a union
                    // needs to have its constraint hoisted into an intersection with said type parameter, this way
                    // the type param can be compared with itself in the target (with the influence of its constraint to match other parts)
                    // For example, if `T extends 1 | 2` and `U extends 2 | 3` and we compare `T & U` to `T & U & (1 | 2 | 3)`
                    var constraint = getEffectiveConstraintOfIntersection(source.flags & 2097152 /* Intersection */ ? source.types : [source], !!(target.flags & 1048576 /* Union */));
                    if (constraint && (source.flags & 2097152 /* Intersection */ || target.flags & 1048576 /* Union */)) {
                        if (everyType(constraint, function (c) { return c !== source; })) { // Skip comparison if expansion contains the source itself
                            // TODO: Stack errors so we get a pyramid for the "normal" comparison above, _and_ a second for this
                            if (result = isRelatedTo(constraint, target, /*reportErrors*/ false, /*headMessage*/ undefined, intersectionState)) {
                                resetErrorInfo(saveErrorInfo);
                            }
                        }
                    }
                }
                // For certain combinations involving intersections and optional, excess, or mismatched properties we need
                // an extra property check where the intersection is viewed as a single object. The following are motivating
                // examples that all should be errors, but aren't without this extra property check:
                //
                //   let obj: { a: { x: string } } & { c: number } = { a: { x: 'hello', y: 2 }, c: 5 };  // Nested excess property
                //
                //   declare let wrong: { a: { y: string } };
                //   let weak: { a?: { x?: number } } & { c?: string } = wrong;  // Nested weak object type
                //
                //   function foo<T extends object>(x: { a?: string }, y: T & { a: boolean }) {
                //     x = y;  // Mismatched property in source intersection
                //   }
                //
                // We suppress recursive intersection property checks because they can generate lots of work when relating
                // recursive intersections that are structurally similar but not exactly identical. See #37854.
                if (result && !inPropertyCheck && (target.flags & 2097152 /* Intersection */ && (isPerformingExcessPropertyChecks || isPerformingCommonPropertyChecks) ||
                    isNonGenericObjectType(target) && !isArrayType(target) && !isTupleType(target) && source.flags & 2097152 /* Intersection */ && getApparentType(source).flags & 3670016 /* StructuredType */ && !ts.some(source.types, function (t) { return !!(ts.getObjectFlags(t) & 2097152 /* NonInferrableType */); }))) {
                    inPropertyCheck = true;
                    result &= recursiveTypeRelatedTo(source, target, reportErrors, 4 /* PropertyCheck */);
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
                        if (source.flags & 524288 /* Object */ && target.flags & 524288 /* Object */) {
                            var currentError = errorInfo;
                            tryElaborateArrayLikeErrors(source, target, reportErrors);
                            if (errorInfo !== currentError) {
                                maybeSuppress = !!errorInfo;
                            }
                        }
                        if (source.flags & 524288 /* Object */ && target.flags & 131068 /* Primitive */) {
                            tryElaborateErrorsForPrimitivesAndObjects(source, target);
                        }
                        else if (source.symbol && source.flags & 524288 /* Object */ && globalObjectType === source) {
                            reportError(ts.Diagnostics.The_Object_type_is_assignable_to_very_few_other_types_Did_you_mean_to_use_the_any_type_instead);
                        }
                        else if (isComparingJsxAttributes && target.flags & 2097152 /* Intersection */) {
                            var targetTypes = target.types;
                            var intrinsicAttributes = getJsxType(JsxNames.IntrinsicAttributes, errorNode);
                            var intrinsicClassAttributes = getJsxType(JsxNames.IntrinsicClassAttributes, errorNode);
                            if (intrinsicAttributes !== errorType && intrinsicClassAttributes !== errorType &&
                                (ts.contains(targetTypes, intrinsicAttributes) || ts.contains(targetTypes, intrinsicClassAttributes))) {
                                // do not report top error
                                return result;
                            }
                        }
                        else {
                            errorInfo = elaborateNeverIntersection(errorInfo, originalTarget);
                        }
                        if (!headMessage && maybeSuppress) {
                            lastSkippedInfo = [source, target];
                            // Used by, eg, missing property checking to replace the top-level message with a more informative one
                            return result;
                        }
                        reportRelationError(headMessage, source, target);
                    }
                }
            }
            function isIdenticalTo(source, target) {
                var flags = source.flags & target.flags;
                if (!(flags & 66584576 /* Substructure */)) {
                    return 0 /* False */;
                }
                if (flags & 3145728 /* UnionOrIntersection */) {
                    var result_5 = eachTypeRelatedToSomeType(source, target);
                    if (result_5) {
                        result_5 &= eachTypeRelatedToSomeType(target, source);
                    }
                    return result_5;
                }
                return recursiveTypeRelatedTo(source, target, /*reportErrors*/ false, 0 /* None */);
            }
            function getTypeOfPropertyInTypes(types, name) {
                var appendPropType = function (propTypes, type) {
                    type = getApparentType(type);
                    var prop = type.flags & 3145728 /* UnionOrIntersection */ ? getPropertyOfUnionOrIntersectionType(type, name) : getPropertyOfObjectType(type, name);
                    var propType = prop && getTypeOfSymbol(prop) || isNumericLiteralName(name) && getIndexTypeOfType(type, 1 /* Number */) || getIndexTypeOfType(type, 0 /* String */) || undefinedType;
                    return ts.append(propTypes, propType);
                };
                return getUnionType(ts.reduceLeft(types, appendPropType, /*initial*/ undefined) || ts.emptyArray);
            }
            function hasExcessProperties(source, target, reportErrors) {
                if (!isExcessPropertyCheckTarget(target) || !noImplicitAny && ts.getObjectFlags(target) & 16384 /* JSLiteral */) {
                    return false; // Disable excess property checks on JS literals to simulate having an implicit "index signature" - but only outside of noImplicitAny
                }
                var isComparingJsxAttributes = !!(ts.getObjectFlags(source) & 4096 /* JsxAttributes */);
                if ((relation === assignableRelation || relation === comparableRelation) &&
                    (isTypeSubsetOf(globalObjectType, target) || (!isComparingJsxAttributes && isEmptyObjectType(target)))) {
                    return false;
                }
                var reducedTarget = target;
                var checkTypes;
                if (target.flags & 1048576 /* Union */) {
                    reducedTarget = findMatchingDiscriminantType(source, target, isRelatedTo) || filterPrimitivesIfContainsNonPrimitive(target);
                    checkTypes = reducedTarget.flags & 1048576 /* Union */ ? reducedTarget.types : [reducedTarget];
                }
                var _loop_13 = function (prop) {
                    if (shouldCheckAsExcessProperty(prop, source.symbol) && !isIgnoredJsxProperty(source, prop)) {
                        if (!isKnownProperty(reducedTarget, prop.escapedName, isComparingJsxAttributes)) {
                            if (reportErrors) {
                                // Report error in terms of object types in the target as those are the only ones
                                // we check in isKnownProperty.
                                var errorTarget = filterType(reducedTarget, isExcessPropertyCheckTarget);
                                // We know *exactly* where things went wrong when comparing the types.
                                // Use this property as the error node as this will be more helpful in
                                // reasoning about what went wrong.
                                if (!errorNode)
                                    return { value: ts.Debug.fail() };
                                if (ts.isJsxAttributes(errorNode) || ts.isJsxOpeningLikeElement(errorNode) || ts.isJsxOpeningLikeElement(errorNode.parent)) {
                                    // JsxAttributes has an object-literal flag and undergo same type-assignablity check as normal object-literal.
                                    // However, using an object-literal error message will be very confusing to the users so we give different a message.
                                    // TODO: Spelling suggestions for excess jsx attributes (needs new diagnostic messages)
                                    if (prop.valueDeclaration && ts.isJsxAttribute(prop.valueDeclaration) && ts.getSourceFileOfNode(errorNode) === ts.getSourceFileOfNode(prop.valueDeclaration.name)) {
                                        // Note that extraneous children (as in `<NoChild>extra</NoChild>`) don't pass this check,
                                        // since `children` is a SyntaxKind.PropertySignature instead of a SyntaxKind.JsxAttribute.
                                        errorNode = prop.valueDeclaration.name;
                                    }
                                    reportError(ts.Diagnostics.Property_0_does_not_exist_on_type_1, symbolToString(prop), typeToString(errorTarget));
                                }
                                else {
                                    // use the property's value declaration if the property is assigned inside the literal itself
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
                var result = -1 /* True */;
                var sourceTypes = source.types;
                for (var _i = 0, sourceTypes_1 = sourceTypes; _i < sourceTypes_1.length; _i++) {
                    var sourceType = sourceTypes_1[_i];
                    var related = typeRelatedToSomeType(sourceType, target, /*reportErrors*/ false);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function typeRelatedToSomeType(source, target, reportErrors) {
                var targetTypes = target.types;
                if (target.flags & 1048576 /* Union */ && containsType(targetTypes, source)) {
                    return -1 /* True */;
                }
                for (var _i = 0, targetTypes_1 = targetTypes; _i < targetTypes_1.length; _i++) {
                    var type = targetTypes_1[_i];
                    var related = isRelatedTo(source, type, /*reportErrors*/ false);
                    if (related) {
                        return related;
                    }
                }
                if (reportErrors) {
                    var bestMatchingType = getBestMatchingType(source, target, isRelatedTo);
                    isRelatedTo(source, bestMatchingType || targetTypes[targetTypes.length - 1], /*reportErrors*/ true);
                }
                return 0 /* False */;
            }
            function typeRelatedToEachType(source, target, reportErrors, intersectionState) {
                var result = -1 /* True */;
                var targetTypes = target.types;
                for (var _i = 0, targetTypes_2 = targetTypes; _i < targetTypes_2.length; _i++) {
                    var targetType = targetTypes_2[_i];
                    var related = isRelatedTo(source, targetType, reportErrors, /*headMessage*/ undefined, intersectionState);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function someTypeRelatedToType(source, target, reportErrors, intersectionState) {
                var sourceTypes = source.types;
                if (source.flags & 1048576 /* Union */ && containsType(sourceTypes, target)) {
                    return -1 /* True */;
                }
                var len = sourceTypes.length;
                for (var i = 0; i < len; i++) {
                    var related = isRelatedTo(sourceTypes[i], target, reportErrors && i === len - 1, /*headMessage*/ undefined, intersectionState);
                    if (related) {
                        return related;
                    }
                }
                return 0 /* False */;
            }
            function eachTypeRelatedToType(source, target, reportErrors, intersectionState) {
                var result = -1 /* True */;
                var sourceTypes = source.types;
                for (var i = 0; i < sourceTypes.length; i++) {
                    var sourceType = sourceTypes[i];
                    if (target.flags & 1048576 /* Union */ && target.types.length === sourceTypes.length) {
                        // many unions are mappings of one another; in such cases, simply comparing members at the same index can shortcut the comparison
                        var related_1 = isRelatedTo(sourceType, target.types[i], /*reportErrors*/ false, /*headMessage*/ undefined, intersectionState);
                        if (related_1) {
                            result &= related_1;
                            continue;
                        }
                    }
                    var related = isRelatedTo(sourceType, target, reportErrors, /*headMessage*/ undefined, intersectionState);
                    if (!related) {
                        return 0 /* False */;
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
                    return 0 /* False */;
                }
                var length = sources.length <= targets.length ? sources.length : targets.length;
                var result = -1 /* True */;
                for (var i = 0; i < length; i++) {
                    // When variance information isn't available we default to covariance. This happens
                    // in the process of computing variance information for recursive types and when
                    // comparing 'this' type arguments.
                    var varianceFlags = i < variances.length ? variances[i] : 1 /* Covariant */;
                    var variance = varianceFlags & 7 /* VarianceMask */;
                    // We ignore arguments for independent type parameters (because they're never witnessed).
                    if (variance !== 4 /* Independent */) {
                        var s = sources[i];
                        var t = targets[i];
                        var related = -1 /* True */;
                        if (varianceFlags & 8 /* Unmeasurable */) {
                            // Even an `Unmeasurable` variance works out without a structural check if the source and target are _identical_.
                            // We can't simply assume invariance, because `Unmeasurable` marks nonlinear relations, for example, a relation tained by
                            // the `-?` modifier in a mapped type (where, no matter how the inputs are related, the outputs still might not be)
                            related = relation === identityRelation ? isRelatedTo(s, t, /*reportErrors*/ false) : compareTypesIdentical(s, t);
                        }
                        else if (variance === 1 /* Covariant */) {
                            related = isRelatedTo(s, t, reportErrors, /*headMessage*/ undefined, intersectionState);
                        }
                        else if (variance === 2 /* Contravariant */) {
                            related = isRelatedTo(t, s, reportErrors, /*headMessage*/ undefined, intersectionState);
                        }
                        else if (variance === 3 /* Bivariant */) {
                            // In the bivariant case we first compare contravariantly without reporting
                            // errors. Then, if that doesn't succeed, we compare covariantly with error
                            // reporting. Thus, error elaboration will be based on the the covariant check,
                            // which is generally easier to reason about.
                            related = isRelatedTo(t, s, /*reportErrors*/ false);
                            if (!related) {
                                related = isRelatedTo(s, t, reportErrors, /*headMessage*/ undefined, intersectionState);
                            }
                        }
                        else {
                            // In the invariant case we first compare covariantly, and only when that
                            // succeeds do we proceed to compare contravariantly. Thus, error elaboration
                            // will typically be based on the covariant check.
                            related = isRelatedTo(s, t, reportErrors, /*headMessage*/ undefined, intersectionState);
                            if (related) {
                                related &= isRelatedTo(t, s, reportErrors, /*headMessage*/ undefined, intersectionState);
                            }
                        }
                        if (!related) {
                            return 0 /* False */;
                        }
                        result &= related;
                    }
                }
                return result;
            }
            // Determine if possibly recursive types are related. First, check if the result is already available in the global cache.
            // Second, check if we have already started a comparison of the given two types in which case we assume the result to be true.
            // Third, check if both types are part of deeply nested chains of generic type instantiations and if so assume the types are
            // equal and infinitely expanding. Fourth, if we have reached a depth of 100 nested comparisons, assume we have runaway recursion
            // and issue an error. Otherwise, actually compare the structure of the two types.
            function recursiveTypeRelatedTo(source, target, reportErrors, intersectionState) {
                if (overflow) {
                    return 0 /* False */;
                }
                var id = getRelationKey(source, target, intersectionState | (inPropertyCheck ? 8 /* InPropertyCheck */ : 0), relation);
                var entry = relation.get(id);
                if (entry !== undefined) {
                    if (reportErrors && entry & 2 /* Failed */ && !(entry & 4 /* Reported */)) {
                        // We are elaborating errors and the cached result is an unreported failure. The result will be reported
                        // as a failure, and should be updated as a reported failure by the bottom of this function.
                    }
                    else {
                        if (outofbandVarianceMarkerHandler) {
                            // We're in the middle of variance checking - integrate any unmeasurable/unreliable flags from this cached component
                            var saved = entry & 24 /* ReportsMask */;
                            if (saved & 8 /* ReportsUnmeasurable */) {
                                instantiateType(source, makeFunctionTypeMapper(reportUnmeasurableMarkers));
                            }
                            if (saved & 16 /* ReportsUnreliable */) {
                                instantiateType(source, makeFunctionTypeMapper(reportUnreliableMarkers));
                            }
                        }
                        return entry & 1 /* Succeeded */ ? -1 /* True */ : 0 /* False */;
                    }
                }
                if (!maybeKeys) {
                    maybeKeys = [];
                    sourceStack = [];
                    targetStack = [];
                }
                else {
                    for (var i = 0; i < maybeCount; i++) {
                        // If source and target are already being compared, consider them related with assumptions
                        if (id === maybeKeys[i]) {
                            return 1 /* Maybe */;
                        }
                    }
                    if (depth === 100) {
                        overflow = true;
                        return 0 /* False */;
                    }
                }
                var maybeStart = maybeCount;
                maybeKeys[maybeCount] = id;
                maybeCount++;
                sourceStack[depth] = source;
                targetStack[depth] = target;
                depth++;
                var saveExpandingFlags = expandingFlags;
                if (!(expandingFlags & 1 /* Source */) && isDeeplyNestedType(source, sourceStack, depth))
                    expandingFlags |= 1 /* Source */;
                if (!(expandingFlags & 2 /* Target */) && isDeeplyNestedType(target, targetStack, depth))
                    expandingFlags |= 2 /* Target */;
                var originalHandler;
                var propagatingVarianceFlags = 0;
                if (outofbandVarianceMarkerHandler) {
                    originalHandler = outofbandVarianceMarkerHandler;
                    outofbandVarianceMarkerHandler = function (onlyUnreliable) {
                        propagatingVarianceFlags |= onlyUnreliable ? 16 /* ReportsUnreliable */ : 8 /* ReportsUnmeasurable */;
                        return originalHandler(onlyUnreliable);
                    };
                }
                var result = expandingFlags !== 3 /* Both */ ? structuredTypeRelatedTo(source, target, reportErrors, intersectionState) : 1 /* Maybe */;
                if (outofbandVarianceMarkerHandler) {
                    outofbandVarianceMarkerHandler = originalHandler;
                }
                expandingFlags = saveExpandingFlags;
                depth--;
                if (result) {
                    if (result === -1 /* True */ || depth === 0) {
                        // If result is definitely true, record all maybe keys as having succeeded
                        for (var i = maybeStart; i < maybeCount; i++) {
                            relation.set(maybeKeys[i], 1 /* Succeeded */ | propagatingVarianceFlags);
                        }
                        maybeCount = maybeStart;
                    }
                }
                else {
                    // A false result goes straight into global cache (when something is false under
                    // assumptions it will also be false without assumptions)
                    relation.set(id, (reportErrors ? 4 /* Reported */ : 0) | 2 /* Failed */ | propagatingVarianceFlags);
                    maybeCount = maybeStart;
                }
                return result;
            }
            function structuredTypeRelatedTo(source, target, reportErrors, intersectionState) {
                if (intersectionState & 4 /* PropertyCheck */) {
                    return propertiesRelatedTo(source, target, reportErrors, /*excludedProperties*/ undefined, 0 /* None */);
                }
                var flags = source.flags & target.flags;
                if (relation === identityRelation && !(flags & 524288 /* Object */)) {
                    if (flags & 4194304 /* Index */) {
                        return isRelatedTo(source.type, target.type, /*reportErrors*/ false);
                    }
                    var result_6 = 0 /* False */;
                    if (flags & 8388608 /* IndexedAccess */) {
                        if (result_6 = isRelatedTo(source.objectType, target.objectType, /*reportErrors*/ false)) {
                            if (result_6 &= isRelatedTo(source.indexType, target.indexType, /*reportErrors*/ false)) {
                                return result_6;
                            }
                        }
                    }
                    if (flags & 16777216 /* Conditional */) {
                        if (source.root.isDistributive === target.root.isDistributive) {
                            if (result_6 = isRelatedTo(source.checkType, target.checkType, /*reportErrors*/ false)) {
                                if (result_6 &= isRelatedTo(source.extendsType, target.extendsType, /*reportErrors*/ false)) {
                                    if (result_6 &= isRelatedTo(getTrueTypeFromConditionalType(source), getTrueTypeFromConditionalType(target), /*reportErrors*/ false)) {
                                        if (result_6 &= isRelatedTo(getFalseTypeFromConditionalType(source), getFalseTypeFromConditionalType(target), /*reportErrors*/ false)) {
                                            return result_6;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (flags & 33554432 /* Substitution */) {
                        return isRelatedTo(source.substitute, target.substitute, /*reportErrors*/ false);
                    }
                    return 0 /* False */;
                }
                var result;
                var originalErrorInfo;
                var varianceCheckFailed = false;
                var saveErrorInfo = captureErrorCalculationState();
                // We limit alias variance probing to only object and conditional types since their alias behavior
                // is more predictable than other, interned types, which may or may not have an alias depending on
                // the order in which things were checked.
                if (source.flags & (524288 /* Object */ | 16777216 /* Conditional */) && source.aliasSymbol &&
                    source.aliasTypeArguments && source.aliasSymbol === target.aliasSymbol &&
                    !(source.aliasTypeArgumentsContainsMarker || target.aliasTypeArgumentsContainsMarker)) {
                    var variances = getAliasVariances(source.aliasSymbol);
                    if (variances === ts.emptyArray) {
                        return 1 /* Maybe */;
                    }
                    var varianceResult = relateVariances(source.aliasTypeArguments, target.aliasTypeArguments, variances, intersectionState);
                    if (varianceResult !== undefined) {
                        return varianceResult;
                    }
                }
                if (target.flags & 262144 /* TypeParameter */) {
                    // A source type { [P in Q]: X } is related to a target type T if keyof T is related to Q and X is related to T[Q].
                    if (ts.getObjectFlags(source) & 32 /* Mapped */ && isRelatedTo(getIndexType(target), getConstraintTypeFromMappedType(source))) {
                        if (!(getMappedTypeModifiers(source) & 4 /* IncludeOptional */)) {
                            var templateType = getTemplateTypeFromMappedType(source);
                            var indexedAccessType = getIndexedAccessType(target, getTypeParameterFromMappedType(source));
                            if (result = isRelatedTo(templateType, indexedAccessType, reportErrors)) {
                                return result;
                            }
                        }
                    }
                }
                else if (target.flags & 4194304 /* Index */) {
                    // A keyof S is related to a keyof T if T is related to S.
                    if (source.flags & 4194304 /* Index */) {
                        if (result = isRelatedTo(target.type, source.type, /*reportErrors*/ false)) {
                            return result;
                        }
                    }
                    // A type S is assignable to keyof T if S is assignable to keyof C, where C is the
                    // simplified form of T or, if T doesn't simplify, the constraint of T.
                    var constraint = getSimplifiedTypeOrConstraint(target.type);
                    if (constraint) {
                        // We require Ternary.True here such that circular constraints don't cause
                        // false positives. For example, given 'T extends { [K in keyof T]: string }',
                        // 'keyof T' has itself as its constraint and produces a Ternary.Maybe when
                        // related to other types.
                        if (isRelatedTo(source, getIndexType(constraint, target.stringsOnly), reportErrors) === -1 /* True */) {
                            return -1 /* True */;
                        }
                    }
                }
                else if (target.flags & 8388608 /* IndexedAccess */) {
                    // A type S is related to a type T[K] if S is related to C, where C is the base
                    // constraint of T[K] for writing.
                    if (relation !== identityRelation) {
                        var objectType = target.objectType;
                        var indexType = target.indexType;
                        var baseObjectType = getBaseConstraintOfType(objectType) || objectType;
                        var baseIndexType = getBaseConstraintOfType(indexType) || indexType;
                        if (!isGenericObjectType(baseObjectType) && !isGenericIndexType(baseIndexType)) {
                            var accessFlags = 2 /* Writing */ | (baseObjectType !== objectType ? 1 /* NoIndexSignatures */ : 0);
                            var constraint = getIndexedAccessTypeOrUndefined(baseObjectType, baseIndexType, /*accessNode*/ undefined, accessFlags);
                            if (constraint && (result = isRelatedTo(source, constraint, reportErrors))) {
                                return result;
                            }
                        }
                    }
                }
                else if (isGenericMappedType(target)) {
                    // A source type T is related to a target type { [P in X]: T[P] }
                    var template = getTemplateTypeFromMappedType(target);
                    var modifiers = getMappedTypeModifiers(target);
                    if (!(modifiers & 8 /* ExcludeOptional */)) {
                        if (template.flags & 8388608 /* IndexedAccess */ && template.objectType === source &&
                            template.indexType === getTypeParameterFromMappedType(target)) {
                            return -1 /* True */;
                        }
                        if (!isGenericMappedType(source)) {
                            var targetConstraint = getConstraintTypeFromMappedType(target);
                            var sourceKeys = getIndexType(source, /*stringsOnly*/ undefined, /*noIndexSignatures*/ true);
                            var includeOptional = modifiers & 4 /* IncludeOptional */;
                            var filteredByApplicability = includeOptional ? intersectTypes(targetConstraint, sourceKeys) : undefined;
                            // A source type T is related to a target type { [P in Q]: X } if Q is related to keyof T and T[Q] is related to X.
                            // A source type T is related to a target type { [P in Q]?: X } if some constituent Q' of Q is related to keyof T and T[Q'] is related to X.
                            if (includeOptional
                                ? !(filteredByApplicability.flags & 131072 /* Never */)
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
                if (source.flags & 8650752 /* TypeVariable */) {
                    if (source.flags & 8388608 /* IndexedAccess */ && target.flags & 8388608 /* IndexedAccess */) {
                        // A type S[K] is related to a type T[J] if S is related to T and K is related to J.
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
                        if (!constraint || (source.flags & 262144 /* TypeParameter */ && constraint.flags & 1 /* Any */)) {
                            // A type variable with no constraint is not related to the non-primitive object type.
                            if (result = isRelatedTo(emptyObjectType, extractTypesOfKind(target, ~67108864 /* NonPrimitive */))) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                        // hi-speed no-this-instantiation check (less accurate, but avoids costly `this`-instantiation when the constraint will suffice), see #28231 for report on why this is needed
                        else if (result = isRelatedTo(constraint, target, /*reportErrors*/ false, /*headMessage*/ undefined, intersectionState)) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                        // slower, fuller, this-instantiated check (necessary when comparing raw `this` types from base classes), see `subclassWithPolymorphicThisIsAssignable.ts` test for example
                        else if (result = isRelatedTo(getTypeWithThisArgument(constraint, source), target, reportErrors, /*headMessage*/ undefined, intersectionState)) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                    }
                }
                else if (source.flags & 4194304 /* Index */) {
                    if (result = isRelatedTo(keyofConstraintType, target, reportErrors)) {
                        resetErrorInfo(saveErrorInfo);
                        return result;
                    }
                }
                else if (source.flags & 16777216 /* Conditional */) {
                    if (target.flags & 16777216 /* Conditional */) {
                        // Two conditional types 'T1 extends U1 ? X1 : Y1' and 'T2 extends U2 ? X2 : Y2' are related if
                        // one of T1 and T2 is related to the other, U1 and U2 are identical types, X1 is related to X2,
                        // and Y1 is related to Y2.
                        var sourceParams = source.root.inferTypeParameters;
                        var sourceExtends = source.extendsType;
                        var mapper = void 0;
                        if (sourceParams) {
                            // If the source has infer type parameters, we instantiate them in the context of the target
                            var ctx = createInferenceContext(sourceParams, /*signature*/ undefined, 0 /* None */, isRelatedTo);
                            inferTypes(ctx.inferences, target.extendsType, sourceExtends, 128 /* NoConstraints */ | 256 /* AlwaysStrict */);
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
                        // conditionals aren't related to one another via distributive constraint as it is much too inaccurate and allows way
                        // more assignments than are desirable (since it maps the source check type to its constraint, it loses information)
                        var distributiveConstraint = getConstraintOfDistributiveConditionalType(source);
                        if (distributiveConstraint) {
                            if (result = isRelatedTo(distributiveConstraint, target, reportErrors)) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                    }
                    // conditionals _can_ be related to one another via normal constraint, as, eg, `A extends B ? O : never` should be assignable to `O`
                    // when `O` is a conditional (`never` is trivially aissgnable to `O`, as is `O`!).
                    var defaultConstraint = getDefaultConstraintOfConditionalType(source);
                    if (defaultConstraint) {
                        if (result = isRelatedTo(defaultConstraint, target, reportErrors)) {
                            resetErrorInfo(saveErrorInfo);
                            return result;
                        }
                    }
                }
                else {
                    // An empty object type is related to any mapped type that includes a '?' modifier.
                    if (relation !== subtypeRelation && relation !== strictSubtypeRelation && isPartialMappedType(target) && isEmptyObjectType(source)) {
                        return -1 /* True */;
                    }
                    if (isGenericMappedType(target)) {
                        if (isGenericMappedType(source)) {
                            if (result = mappedTypeRelatedTo(source, target, reportErrors)) {
                                resetErrorInfo(saveErrorInfo);
                                return result;
                            }
                        }
                        return 0 /* False */;
                    }
                    var sourceIsPrimitive = !!(source.flags & 131068 /* Primitive */);
                    if (relation !== identityRelation) {
                        source = getApparentType(source);
                    }
                    else if (isGenericMappedType(source)) {
                        return 0 /* False */;
                    }
                    if (ts.getObjectFlags(source) & 4 /* Reference */ && ts.getObjectFlags(target) & 4 /* Reference */ && source.target === target.target &&
                        !(ts.getObjectFlags(source) & 8192 /* MarkerType */ || ts.getObjectFlags(target) & 8192 /* MarkerType */)) {
                        // We have type references to the same generic type, and the type references are not marker
                        // type references (which are intended by be compared structurally). Obtain the variance
                        // information for the type parameters and relate the type arguments accordingly.
                        var variances = getVariances(source.target);
                        // We return Ternary.Maybe for a recursive invocation of getVariances (signalled by emptyArray). This
                        // effectively means we measure variance only from type parameter occurrences that aren't nested in
                        // recursive instantiations of the generic type.
                        if (variances === ts.emptyArray) {
                            return 1 /* Maybe */;
                        }
                        var varianceResult = relateVariances(getTypeArguments(source), getTypeArguments(target), variances, intersectionState);
                        if (varianceResult !== undefined) {
                            return varianceResult;
                        }
                    }
                    else if (isReadonlyArrayType(target) ? isArrayType(source) || isTupleType(source) : isArrayType(target) && isTupleType(source) && !source.target.readonly) {
                        if (relation !== identityRelation) {
                            return isRelatedTo(getIndexTypeOfType(source, 1 /* Number */) || anyType, getIndexTypeOfType(target, 1 /* Number */) || anyType, reportErrors);
                        }
                        else {
                            // By flags alone, we know that the `target` is a readonly array while the source is a normal array or tuple
                            // or `target` is an array and source is a tuple - in both cases the types cannot be identical, by construction
                            return 0 /* False */;
                        }
                    }
                    // Consider a fresh empty object literal type "closed" under the subtype relationship - this way `{} <- {[idx: string]: any} <- fresh({})`
                    // and not `{} <- fresh({}) <- {[idx: string]: any}`
                    else if ((relation === subtypeRelation || relation === strictSubtypeRelation) && isEmptyObjectType(target) && ts.getObjectFlags(target) & 32768 /* FreshLiteral */ && !isEmptyObjectType(source)) {
                        return 0 /* False */;
                    }
                    // Even if relationship doesn't hold for unions, intersections, or generic type references,
                    // it may hold in a structural comparison.
                    // In a check of the form X = A & B, we will have previously checked if A relates to X or B relates
                    // to X. Failing both of those we want to check if the aggregation of A and B's members structurally
                    // relates to X. Thus, we include intersection types on the source side here.
                    if (source.flags & (524288 /* Object */ | 2097152 /* Intersection */) && target.flags & 524288 /* Object */) {
                        // Report structural errors only if we haven't reported any errors yet
                        var reportStructuralErrors = reportErrors && errorInfo === saveErrorInfo.errorInfo && !sourceIsPrimitive;
                        result = propertiesRelatedTo(source, target, reportStructuralErrors, /*excludedProperties*/ undefined, intersectionState);
                        if (result) {
                            result &= signaturesRelatedTo(source, target, 0 /* Call */, reportStructuralErrors);
                            if (result) {
                                result &= signaturesRelatedTo(source, target, 1 /* Construct */, reportStructuralErrors);
                                if (result) {
                                    result &= indexTypesRelatedTo(source, target, 0 /* String */, sourceIsPrimitive, reportStructuralErrors, intersectionState);
                                    if (result) {
                                        result &= indexTypesRelatedTo(source, target, 1 /* Number */, sourceIsPrimitive, reportStructuralErrors, intersectionState);
                                    }
                                }
                            }
                        }
                        if (varianceCheckFailed && result) {
                            errorInfo = originalErrorInfo || errorInfo || saveErrorInfo.errorInfo; // Use variance error (there is no structural one) and return false
                        }
                        else if (result) {
                            return result;
                        }
                    }
                    // If S is an object type and T is a discriminated union, S may be related to T if
                    // there exists a constituent of T for every combination of the discriminants of S
                    // with respect to T. We do not report errors here, as we will use the existing
                    // error result from checking each constituent of the union.
                    if (source.flags & (524288 /* Object */ | 2097152 /* Intersection */) && target.flags & 1048576 /* Union */) {
                        var objectOnlyTarget = extractTypesOfKind(target, 524288 /* Object */ | 2097152 /* Intersection */ | 33554432 /* Substitution */);
                        if (objectOnlyTarget.flags & 1048576 /* Union */) {
                            var result_7 = typeRelatedToDiscriminatedType(source, objectOnlyTarget);
                            if (result_7) {
                                return result_7;
                            }
                        }
                    }
                }
                return 0 /* False */;
                function relateVariances(sourceTypeArguments, targetTypeArguments, variances, intersectionState) {
                    if (result = typeArgumentsRelatedTo(sourceTypeArguments, targetTypeArguments, variances, reportErrors, intersectionState)) {
                        return result;
                    }
                    if (ts.some(variances, function (v) { return !!(v & 24 /* AllowsStructuralFallback */); })) {
                        // If some type parameter was `Unmeasurable` or `Unreliable`, and we couldn't pass by assuming it was identical, then we
                        // have to allow a structural fallback check
                        // We elide the variance-based error elaborations, since those might not be too helpful, since we'll potentially
                        // be assuming identity of the type parameter.
                        originalErrorInfo = undefined;
                        resetErrorInfo(saveErrorInfo);
                        return undefined;
                    }
                    var allowStructuralFallback = targetTypeArguments && hasCovariantVoidArgument(targetTypeArguments, variances);
                    varianceCheckFailed = !allowStructuralFallback;
                    // The type arguments did not relate appropriately, but it may be because we have no variance
                    // information (in which case typeArgumentsRelatedTo defaulted to covariance for all type
                    // arguments). It might also be the case that the target type has a 'void' type argument for
                    // a covariant type parameter that is only used in return positions within the generic type
                    // (in which case any type argument is permitted on the source side). In those cases we proceed
                    // with a structural comparison. Otherwise, we know for certain the instantiations aren't
                    // related and we can return here.
                    if (variances !== ts.emptyArray && !allowStructuralFallback) {
                        // In some cases generic types that are covariant in regular type checking mode become
                        // invariant in --strictFunctionTypes mode because one or more type parameters are used in
                        // both co- and contravariant positions. In order to make it easier to diagnose *why* such
                        // types are invariant, if any of the type parameters are invariant we reset the reported
                        // errors and instead force a structural comparison (which will include elaborations that
                        // reveal the reason).
                        // We can switch on `reportErrors` here, since varianceCheckFailed guarantees we return `False`,
                        // we can return `False` early here to skip calculating the structural error message we don't need.
                        if (varianceCheckFailed && !(reportErrors && ts.some(variances, function (v) { return (v & 7 /* VarianceMask */) === 0 /* Invariant */; }))) {
                            return 0 /* False */;
                        }
                        // We remember the original error information so we can restore it in case the structural
                        // comparison unexpectedly succeeds. This can happen when the structural comparison result
                        // is a Ternary.Maybe for example caused by the recursion depth limiter.
                        originalErrorInfo = errorInfo;
                        resetErrorInfo(saveErrorInfo);
                    }
                }
            }
            function reportUnmeasurableMarkers(p) {
                if (outofbandVarianceMarkerHandler && (p === markerSuperType || p === markerSubType || p === markerOtherType)) {
                    outofbandVarianceMarkerHandler(/*onlyUnreliable*/ false);
                }
                return p;
            }
            function reportUnreliableMarkers(p) {
                if (outofbandVarianceMarkerHandler && (p === markerSuperType || p === markerSubType || p === markerOtherType)) {
                    outofbandVarianceMarkerHandler(/*onlyUnreliable*/ true);
                }
                return p;
            }
            // A type [P in S]: X is related to a type [Q in T]: Y if T is related to S and X' is
            // related to Y, where X' is an instantiation of X in which P is replaced with Q. Notice
            // that S and T are contra-variant whereas X and Y are co-variant.
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
                return 0 /* False */;
            }
            function typeRelatedToDiscriminatedType(source, target) {
                // 1. Generate the combinations of discriminant properties & types 'source' can satisfy.
                //    a. If the number of combinations is above a set limit, the comparison is too complex.
                // 2. Filter 'target' to the subset of types whose discriminants exist in the matrix.
                //    a. If 'target' does not satisfy all discriminants in the matrix, 'source' is not related.
                // 3. For each type in the filtered 'target', determine if all non-discriminant properties of
                //    'target' are related to a property in 'source'.
                //
                // NOTE: See ~/tests/cases/conformance/types/typeRelationships/assignmentCompatibility/assignmentCompatWithDiscriminatedUnion.ts
                //       for examples.
                var sourceProperties = getPropertiesOfType(source);
                var sourcePropertiesFiltered = findDiscriminantProperties(sourceProperties, target);
                if (!sourcePropertiesFiltered)
                    return 0 /* False */;
                // Though we could compute the number of combinations as we generate
                // the matrix, this would incur additional memory overhead due to
                // array allocations. To reduce this overhead, we first compute
                // the number of combinations to ensure we will not surpass our
                // fixed limit before incurring the cost of any allocations:
                var numCombinations = 1;
                for (var _i = 0, sourcePropertiesFiltered_1 = sourcePropertiesFiltered; _i < sourcePropertiesFiltered_1.length; _i++) {
                    var sourceProperty = sourcePropertiesFiltered_1[_i];
                    numCombinations *= countTypes(getTypeOfSymbol(sourceProperty));
                    if (numCombinations > 25) {
                        // We've reached the complexity limit.
                        return 0 /* False */;
                    }
                }
                // Compute the set of types for each discriminant property.
                var sourceDiscriminantTypes = new Array(sourcePropertiesFiltered.length);
                var excludedProperties = ts.createUnderscoreEscapedMap();
                for (var i = 0; i < sourcePropertiesFiltered.length; i++) {
                    var sourceProperty = sourcePropertiesFiltered[i];
                    var sourcePropertyType = getTypeOfSymbol(sourceProperty);
                    sourceDiscriminantTypes[i] = sourcePropertyType.flags & 1048576 /* Union */
                        ? sourcePropertyType.types
                        : [sourcePropertyType];
                    excludedProperties.set(sourceProperty.escapedName, true);
                }
                // Match each combination of the cartesian product of discriminant properties to one or more
                // constituents of 'target'. If any combination does not have a match then 'source' is not relatable.
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
                            // We compare the source property to the target in the context of a single discriminant type.
                            var related = propertyRelatedTo(source, target, sourceProperty, targetProperty, function (_) { return combination[i]; }, /*reportErrors*/ false, 0 /* None */, /*skipOptional*/ strictNullChecks || relation === comparableRelation);
                            // If the target property could not be found, or if the properties were not related,
                            // then this constituent is not a match.
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
                        return { value: 0 /* False */ };
                    }
                };
                for (var _a = 0, discriminantCombinations_1 = discriminantCombinations; _a < discriminantCombinations_1.length; _a++) {
                    var combination = discriminantCombinations_1[_a];
                    var state_6 = _loop_14(combination);
                    if (typeof state_6 === "object")
                        return state_6.value;
                }
                // Compare the remaining non-discriminant properties of each match.
                var result = -1 /* True */;
                for (var _b = 0, matchingTypes_1 = matchingTypes; _b < matchingTypes_1.length; _b++) {
                    var type = matchingTypes_1[_b];
                    result &= propertiesRelatedTo(source, type, /*reportErrors*/ false, excludedProperties, 0 /* None */);
                    if (result) {
                        result &= signaturesRelatedTo(source, type, 0 /* Call */, /*reportStructuralErrors*/ false);
                        if (result) {
                            result &= signaturesRelatedTo(source, type, 1 /* Construct */, /*reportStructuralErrors*/ false);
                            if (result) {
                                result &= indexTypesRelatedTo(source, type, 0 /* String */, /*sourceIsPrimitive*/ false, /*reportStructuralErrors*/ false, 0 /* None */);
                                if (result) {
                                    result &= indexTypesRelatedTo(source, type, 1 /* Number */, /*sourceIsPrimitive*/ false, /*reportStructuralErrors*/ false, 0 /* None */);
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
                var targetIsOptional = strictNullChecks && !!(ts.getCheckFlags(targetProp) & 48 /* Partial */);
                var source = getTypeOfSourceProperty(sourceProp);
                if (ts.getCheckFlags(targetProp) & 65536 /* DeferredType */ && !getSymbolLinks(targetProp).type) {
                    // Rather than resolving (and normalizing) the type, relate constituent-by-constituent without performing normalization or seconadary passes
                    var links = getSymbolLinks(targetProp);
                    ts.Debug.assertIsDefined(links.deferralParent);
                    ts.Debug.assertIsDefined(links.deferralConstituents);
                    var unionParent = !!(links.deferralParent.flags & 1048576 /* Union */);
                    var result_9 = unionParent ? 0 /* False */ : -1 /* True */;
                    var targetTypes = links.deferralConstituents;
                    for (var _i = 0, targetTypes_3 = targetTypes; _i < targetTypes_3.length; _i++) {
                        var targetType = targetTypes_3[_i];
                        var related = isRelatedTo(source, targetType, /*reportErrors*/ false, /*headMessage*/ undefined, unionParent ? 0 : 2 /* Target */);
                        if (!unionParent) {
                            if (!related) {
                                // Can't assign to a target individually - have to fallback to assigning to the _whole_ intersection (which forces normalization)
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
                        // The easiest way to get the right errors here is to un-defer (which may be costly)
                        // If it turns out this is too costly too often, we can replicate the error handling logic within
                        // typeRelatedToSomeType without the discriminatable type branch (as that requires a manifest union
                        // type on which to hand discriminable properties, which we are expressly trying to avoid here)
                        return isRelatedTo(source, addOptionality(getTypeOfSymbol(targetProp), targetIsOptional), reportErrors);
                    }
                    return result_9;
                }
                else {
                    return isRelatedTo(source, addOptionality(getTypeOfSymbol(targetProp), targetIsOptional), reportErrors, /*headMessage*/ undefined, intersectionState);
                }
            }
            function propertyRelatedTo(source, target, sourceProp, targetProp, getTypeOfSourceProperty, reportErrors, intersectionState, skipOptional) {
                var sourcePropFlags = ts.getDeclarationModifierFlagsFromSymbol(sourceProp);
                var targetPropFlags = ts.getDeclarationModifierFlagsFromSymbol(targetProp);
                if (sourcePropFlags & 8 /* Private */ || targetPropFlags & 8 /* Private */) {
                    if (sourceProp.valueDeclaration !== targetProp.valueDeclaration) {
                        if (reportErrors) {
                            if (sourcePropFlags & 8 /* Private */ && targetPropFlags & 8 /* Private */) {
                                reportError(ts.Diagnostics.Types_have_separate_declarations_of_a_private_property_0, symbolToString(targetProp));
                            }
                            else {
                                reportError(ts.Diagnostics.Property_0_is_private_in_type_1_but_not_in_type_2, symbolToString(targetProp), typeToString(sourcePropFlags & 8 /* Private */ ? source : target), typeToString(sourcePropFlags & 8 /* Private */ ? target : source));
                            }
                        }
                        return 0 /* False */;
                    }
                }
                else if (targetPropFlags & 16 /* Protected */) {
                    if (!isValidOverrideOf(sourceProp, targetProp)) {
                        if (reportErrors) {
                            reportError(ts.Diagnostics.Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2, symbolToString(targetProp), typeToString(getDeclaringClass(sourceProp) || source), typeToString(getDeclaringClass(targetProp) || target));
                        }
                        return 0 /* False */;
                    }
                }
                else if (sourcePropFlags & 16 /* Protected */) {
                    if (reportErrors) {
                        reportError(ts.Diagnostics.Property_0_is_protected_in_type_1_but_public_in_type_2, symbolToString(targetProp), typeToString(source), typeToString(target));
                    }
                    return 0 /* False */;
                }
                // If the target comes from a partial union prop, allow `undefined` in the target type
                var related = isPropertySymbolTypeRelated(sourceProp, targetProp, getTypeOfSourceProperty, reportErrors, intersectionState);
                if (!related) {
                    if (reportErrors) {
                        reportIncompatibleError(ts.Diagnostics.Types_of_property_0_are_incompatible, symbolToString(targetProp));
                    }
                    return 0 /* False */;
                }
                // When checking for comparability, be more lenient with optional properties.
                if (!skipOptional && sourceProp.flags & 16777216 /* Optional */ && !(targetProp.flags & 16777216 /* Optional */)) {
                    // TypeScript 1.0 spec (April 2014): 3.8.3
                    // S is a subtype of a type T, and T is a supertype of S if ...
                    // S' and T are object types and, for each member M in T..
                    // M is a property and S' contains a property N where
                    // if M is a required property, N is also a required property
                    // (M - property in T)
                    // (N - property in S)
                    if (reportErrors) {
                        reportError(ts.Diagnostics.Property_0_is_optional_in_type_1_but_required_in_type_2, symbolToString(targetProp), typeToString(source), typeToString(target));
                    }
                    return 0 /* False */;
                }
                return related;
            }
            function reportUnmatchedProperty(source, target, unmatchedProperty, requireOptionalProperties) {
                var shouldSkipElaboration = false;
                // give specific error in case where private names have the same description
                if (unmatchedProperty.valueDeclaration
                    && ts.isNamedDeclaration(unmatchedProperty.valueDeclaration)
                    && ts.isPrivateIdentifier(unmatchedProperty.valueDeclaration.name)
                    && source.symbol
                    && source.symbol.flags & 32 /* Class */) {
                    var privateIdentifierDescription = unmatchedProperty.valueDeclaration.name.escapedText;
                    var symbolTableKey = ts.getSymbolNameForPrivateIdentifier(source.symbol, privateIdentifierDescription);
                    if (symbolTableKey && getPropertyOfType(source, symbolTableKey)) {
                        var sourceName = ts.getDeclarationName(source.symbol.valueDeclaration);
                        var targetName = ts.getDeclarationName(target.symbol.valueDeclaration);
                        reportError(ts.Diagnostics.Property_0_in_type_1_refers_to_a_different_member_that_cannot_be_accessed_from_within_type_2, diagnosticName(privateIdentifierDescription), diagnosticName(sourceName.escapedText === "" ? anon : sourceName), diagnosticName(targetName.escapedText === "" ? anon : targetName));
                        return;
                    }
                }
                var props = ts.arrayFrom(getUnmatchedProperties(source, target, requireOptionalProperties, /*matchDiscriminantProperties*/ false));
                if (!headMessage || (headMessage.code !== ts.Diagnostics.Class_0_incorrectly_implements_interface_1.code &&
                    headMessage.code !== ts.Diagnostics.Class_0_incorrectly_implements_class_1_Did_you_mean_to_extend_1_and_inherit_its_members_as_a_subclass.code)) {
                    shouldSkipElaboration = true; // Retain top-level error for interface implementing issues, otherwise omit it
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
                else if (tryElaborateArrayLikeErrors(source, target, /*reportErrors*/ false)) {
                    if (props.length > 5) { // arbitrary cutoff for too-long list form
                        reportError(ts.Diagnostics.Type_0_is_missing_the_following_properties_from_type_1_Colon_2_and_3_more, typeToString(source), typeToString(target), ts.map(props.slice(0, 4), function (p) { return symbolToString(p); }).join(", "), props.length - 4);
                    }
                    else {
                        reportError(ts.Diagnostics.Type_0_is_missing_the_following_properties_from_type_1_Colon_2, typeToString(source), typeToString(target), ts.map(props, function (p) { return symbolToString(p); }).join(", "));
                    }
                    if (shouldSkipElaboration && errorInfo) {
                        overrideNextErrorInfo++;
                    }
                }
                // No array like or unmatched property error - just issue top level error (errorInfo = undefined)
            }
            function propertiesRelatedTo(source, target, reportErrors, excludedProperties, intersectionState) {
                if (relation === identityRelation) {
                    return propertiesIdenticalTo(source, target, excludedProperties);
                }
                var requireOptionalProperties = (relation === subtypeRelation || relation === strictSubtypeRelation) && !isObjectLiteralType(source) && !isEmptyArrayLiteralType(source) && !isTupleType(source);
                var unmatchedProperty = getUnmatchedProperty(source, target, requireOptionalProperties, /*matchDiscriminantProperties*/ false);
                if (unmatchedProperty) {
                    if (reportErrors) {
                        reportUnmatchedProperty(source, target, unmatchedProperty, requireOptionalProperties);
                    }
                    return 0 /* False */;
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
                                return 0 /* False */;
                            }
                        }
                    }
                }
                var result = -1 /* True */;
                if (isTupleType(target)) {
                    var targetRestType = getRestTypeOfTupleType(target);
                    if (targetRestType) {
                        if (!isTupleType(source)) {
                            return 0 /* False */;
                        }
                        var sourceRestType = getRestTypeOfTupleType(source);
                        if (sourceRestType && !isRelatedTo(sourceRestType, targetRestType, reportErrors)) {
                            if (reportErrors) {
                                reportError(ts.Diagnostics.Rest_signatures_are_incompatible);
                            }
                            return 0 /* False */;
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
                                return 0 /* False */;
                            }
                            result &= related;
                        }
                    }
                }
                // We only call this for union target types when we're attempting to do excess property checking - in those cases, we want to get _all possible props_
                // from the target union, across all members
                var properties = getPropertiesOfType(target);
                var numericNamesOnly = isTupleType(source) && isTupleType(target);
                for (var _b = 0, _c = excludeProperties(properties, excludedProperties); _b < _c.length; _b++) {
                    var targetProp = _c[_b];
                    var name = targetProp.escapedName;
                    if (!(targetProp.flags & 4194304 /* Prototype */) && (!numericNamesOnly || isNumericLiteralName(name) || name === "length")) {
                        var sourceProp = getPropertyOfType(source, name);
                        if (sourceProp && sourceProp !== targetProp) {
                            var related = propertyRelatedTo(source, target, sourceProp, targetProp, getTypeOfSymbol, reportErrors, intersectionState, relation === comparableRelation);
                            if (!related) {
                                return 0 /* False */;
                            }
                            result &= related;
                        }
                    }
                }
                return result;
            }
            function propertiesIdenticalTo(source, target, excludedProperties) {
                if (!(source.flags & 524288 /* Object */ && target.flags & 524288 /* Object */)) {
                    return 0 /* False */;
                }
                var sourceProperties = excludeProperties(getPropertiesOfObjectType(source), excludedProperties);
                var targetProperties = excludeProperties(getPropertiesOfObjectType(target), excludedProperties);
                if (sourceProperties.length !== targetProperties.length) {
                    return 0 /* False */;
                }
                var result = -1 /* True */;
                for (var _i = 0, sourceProperties_1 = sourceProperties; _i < sourceProperties_1.length; _i++) {
                    var sourceProp = sourceProperties_1[_i];
                    var targetProp = getPropertyOfObjectType(target, sourceProp.escapedName);
                    if (!targetProp) {
                        return 0 /* False */;
                    }
                    var related = compareProperties(sourceProp, targetProp, isRelatedTo);
                    if (!related) {
                        return 0 /* False */;
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
                    return -1 /* True */;
                }
                var sourceIsJSConstructor = source.symbol && isJSConstructor(source.symbol.valueDeclaration);
                var targetIsJSConstructor = target.symbol && isJSConstructor(target.symbol.valueDeclaration);
                var sourceSignatures = getSignaturesOfType(source, (sourceIsJSConstructor && kind === 1 /* Construct */) ?
                    0 /* Call */ : kind);
                var targetSignatures = getSignaturesOfType(target, (targetIsJSConstructor && kind === 1 /* Construct */) ?
                    0 /* Call */ : kind);
                if (kind === 1 /* Construct */ && sourceSignatures.length && targetSignatures.length) {
                    if (ts.isAbstractConstructorType(source) && !ts.isAbstractConstructorType(target)) {
                        // An abstract constructor type is not assignable to a non-abstract constructor type
                        // as it would otherwise be possible to new an abstract class. Note that the assignability
                        // check we perform for an extends clause excludes construct signatures from the target,
                        // so this check never proceeds.
                        if (reportErrors) {
                            reportError(ts.Diagnostics.Cannot_assign_an_abstract_constructor_type_to_a_non_abstract_constructor_type);
                        }
                        return 0 /* False */;
                    }
                    if (!constructorVisibilitiesAreCompatible(sourceSignatures[0], targetSignatures[0], reportErrors)) {
                        return 0 /* False */;
                    }
                }
                var result = -1 /* True */;
                var saveErrorInfo = captureErrorCalculationState();
                var incompatibleReporter = kind === 1 /* Construct */ ? reportIncompatibleConstructSignatureReturn : reportIncompatibleCallSignatureReturn;
                if (ts.getObjectFlags(source) & 64 /* Instantiated */ && ts.getObjectFlags(target) & 64 /* Instantiated */ && source.symbol === target.symbol) {
                    // We have instantiations of the same anonymous type (which typically will be the type of a
                    // method). Simply do a pairwise comparison of the signatures in the two signature lists instead
                    // of the much more expensive N * M comparison matrix we explore below. We erase type parameters
                    // as they are known to always be the same.
                    for (var i = 0; i < targetSignatures.length; i++) {
                        var related = signatureRelatedTo(sourceSignatures[i], targetSignatures[i], /*erase*/ true, reportErrors, incompatibleReporter(sourceSignatures[i], targetSignatures[i]));
                        if (!related) {
                            return 0 /* False */;
                        }
                        result &= related;
                    }
                }
                else if (sourceSignatures.length === 1 && targetSignatures.length === 1) {
                    // For simple functions (functions with a single signature) we only erase type parameters for
                    // the comparable relation. Otherwise, if the source signature is generic, we instantiate it
                    // in the context of the target signature before checking the relationship. Ideally we'd do
                    // this regardless of the number of signatures, but the potential costs are prohibitive due
                    // to the quadratic nature of the logic below.
                    var eraseGenerics = relation === comparableRelation || !!compilerOptions.noStrictGenericChecks;
                    result = signatureRelatedTo(sourceSignatures[0], targetSignatures[0], eraseGenerics, reportErrors, incompatibleReporter(sourceSignatures[0], targetSignatures[0]));
                }
                else {
                    outer: for (var _i = 0, targetSignatures_1 = targetSignatures; _i < targetSignatures_1.length; _i++) {
                        var t = targetSignatures_1[_i];
                        // Only elaborate errors from the first failure
                        var shouldElaborateErrors = reportErrors;
                        for (var _a = 0, sourceSignatures_1 = sourceSignatures; _a < sourceSignatures_1.length; _a++) {
                            var s = sourceSignatures_1[_a];
                            var related = signatureRelatedTo(s, t, /*erase*/ true, shouldElaborateErrors, incompatibleReporter(s, t));
                            if (related) {
                                result &= related;
                                resetErrorInfo(saveErrorInfo);
                                continue outer;
                            }
                            shouldElaborateErrors = false;
                        }
                        if (shouldElaborateErrors) {
                            reportError(ts.Diagnostics.Type_0_provides_no_match_for_the_signature_1, typeToString(source), signatureToString(t, /*enclosingDeclaration*/ undefined, /*flags*/ undefined, kind));
                        }
                        return 0 /* False */;
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
            /**
             * See signatureAssignableTo, compareSignaturesIdentical
             */
            function signatureRelatedTo(source, target, erase, reportErrors, incompatibleReporter) {
                return compareSignaturesRelated(erase ? getErasedSignature(source) : source, erase ? getErasedSignature(target) : target, relation === strictSubtypeRelation ? 8 /* StrictArity */ : 0, reportErrors, reportError, incompatibleReporter, isRelatedTo, makeFunctionTypeMapper(reportUnreliableMarkers));
            }
            function signaturesIdenticalTo(source, target, kind) {
                var sourceSignatures = getSignaturesOfType(source, kind);
                var targetSignatures = getSignaturesOfType(target, kind);
                if (sourceSignatures.length !== targetSignatures.length) {
                    return 0 /* False */;
                }
                var result = -1 /* True */;
                for (var i = 0; i < sourceSignatures.length; i++) {
                    var related = compareSignaturesIdentical(sourceSignatures[i], targetSignatures[i], /*partialMatch*/ false, /*ignoreThisTypes*/ false, /*ignoreReturnTypes*/ false, isRelatedTo);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function eachPropertyRelatedTo(source, target, kind, reportErrors) {
                var result = -1 /* True */;
                var props = source.flags & 2097152 /* Intersection */ ? getPropertiesOfUnionOrIntersectionType(source) : getPropertiesOfObjectType(source);
                for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
                    var prop = props_2[_i];
                    // Skip over ignored JSX and symbol-named members
                    if (isIgnoredJsxProperty(source, prop)) {
                        continue;
                    }
                    var nameType = getSymbolLinks(prop).nameType;
                    if (nameType && nameType.flags & 8192 /* UniqueESSymbol */) {
                        continue;
                    }
                    if (kind === 0 /* String */ || isNumericLiteralName(prop.escapedName)) {
                        var related = isRelatedTo(getTypeOfSymbol(prop), target, reportErrors);
                        if (!related) {
                            if (reportErrors) {
                                reportError(ts.Diagnostics.Property_0_is_incompatible_with_index_signature, symbolToString(prop));
                            }
                            return 0 /* False */;
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
                if (!targetType || targetType.flags & 1 /* Any */ && !sourceIsPrimitive) {
                    // Index signature of type any permits assignment from everything but primitives
                    return -1 /* True */;
                }
                if (isGenericMappedType(source)) {
                    // A generic mapped type { [P in K]: T } is related to an index signature { [x: string]: U }
                    // if T is related to U.
                    return kind === 0 /* String */ ? isRelatedTo(getTemplateTypeFromMappedType(source), targetType, reportErrors) : 0 /* False */;
                }
                var indexType = getIndexTypeOfType(source, kind) || kind === 1 /* Number */ && getIndexTypeOfType(source, 0 /* String */);
                if (indexType) {
                    return indexTypeRelatedTo(indexType, targetType, reportErrors);
                }
                if (!(intersectionState & 1 /* Source */) && isObjectTypeWithInferableIndex(source)) {
                    // Intersection constituents are never considered to have an inferred index signature
                    var related = eachPropertyRelatedTo(source, targetType, kind, reportErrors);
                    if (related && kind === 0 /* String */) {
                        var numberIndexType = getIndexTypeOfType(source, 1 /* Number */);
                        if (numberIndexType) {
                            related &= indexTypeRelatedTo(numberIndexType, targetType, reportErrors);
                        }
                    }
                    return related;
                }
                if (reportErrors) {
                    reportError(ts.Diagnostics.Index_signature_is_missing_in_type_0, typeToString(source));
                }
                return 0 /* False */;
            }
            function indexTypesIdenticalTo(source, target, indexKind) {
                var targetInfo = getIndexInfoOfType(target, indexKind);
                var sourceInfo = getIndexInfoOfType(source, indexKind);
                if (!sourceInfo && !targetInfo) {
                    return -1 /* True */;
                }
                if (sourceInfo && targetInfo && sourceInfo.isReadonly === targetInfo.isReadonly) {
                    return isRelatedTo(sourceInfo.type, targetInfo.type);
                }
                return 0 /* False */;
            }
            function constructorVisibilitiesAreCompatible(sourceSignature, targetSignature, reportErrors) {
                if (!sourceSignature.declaration || !targetSignature.declaration) {
                    return true;
                }
                var sourceAccessibility = ts.getSelectedModifierFlags(sourceSignature.declaration, 24 /* NonPublicAccessibilityModifier */);
                var targetAccessibility = ts.getSelectedModifierFlags(targetSignature.declaration, 24 /* NonPublicAccessibilityModifier */);
                // A public, protected and private signature is assignable to a private signature.
                if (targetAccessibility === 8 /* Private */) {
                    return true;
                }
                // A public and protected signature is assignable to a protected signature.
                if (targetAccessibility === 16 /* Protected */ && sourceAccessibility !== 8 /* Private */) {
                    return true;
                }
                // Only a public signature is assignable to public signature.
                if (targetAccessibility !== 16 /* Protected */ && !sourceAccessibility) {
                    return true;
                }
                if (reportErrors) {
                    reportError(ts.Diagnostics.Cannot_assign_a_0_constructor_type_to_a_1_constructor_type, visibilityToString(sourceAccessibility), visibilityToString(targetAccessibility));
                }
                return false;
            }
        }
