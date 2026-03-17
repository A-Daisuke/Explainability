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
