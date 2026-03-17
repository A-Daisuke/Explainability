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
