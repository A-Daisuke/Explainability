        function checkGrammarForUseStrictSimpleParameterList(node) {
            if (languageVersion >= 3 /* ES2016 */) {
                var useStrictDirective_1 = node.body && ts.isBlock(node.body) && ts.findUseStrictPrologue(node.body.statements);
                if (useStrictDirective_1) {
                    var nonSimpleParameters = getNonSimpleParameters(node.parameters);
                    if (ts.length(nonSimpleParameters)) {
                        ts.forEach(nonSimpleParameters, function (parameter) {
                            ts.addRelatedInfo(error(parameter, ts.Diagnostics.This_parameter_is_not_allowed_with_use_strict_directive), ts.createDiagnosticForNode(useStrictDirective_1, ts.Diagnostics.use_strict_directive_used_here));
                        });
                        var diagnostics_1 = nonSimpleParameters.map(function (parameter, index) { return (index === 0 ? ts.createDiagnosticForNode(parameter, ts.Diagnostics.Non_simple_parameter_declared_here) : ts.createDiagnosticForNode(parameter, ts.Diagnostics.and_here)); });
                        ts.addRelatedInfo.apply(void 0, __spreadArrays([error(useStrictDirective_1, ts.Diagnostics.use_strict_directive_cannot_be_used_with_non_simple_parameter_list)], diagnostics_1));
                        return true;
                    }
                }
            }
            return false;
        }
