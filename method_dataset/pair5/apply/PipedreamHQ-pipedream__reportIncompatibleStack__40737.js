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
