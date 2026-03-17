        function reportNonExportedMember(node, name, declarationName, moduleSymbol, moduleName) {
            var _a;
            var localSymbol = (_a = moduleSymbol.valueDeclaration.locals) === null || _a === void 0 ? void 0 : _a.get(name.escapedText);
            var exports = moduleSymbol.exports;
            if (localSymbol) {
                var exportedEqualsSymbol = exports === null || exports === void 0 ? void 0 : exports.get("export=");
                if (exportedEqualsSymbol) {
                    getSymbolIfSameReference(exportedEqualsSymbol, localSymbol) ? reportInvalidImportEqualsExportMember(node, name, declarationName, moduleName) :
                        error(name, ts.Diagnostics.Module_0_has_no_exported_member_1, moduleName, declarationName);
                }
                else {
                    var exportedSymbol = exports ? ts.find(symbolsToArray(exports), function (symbol) { return !!getSymbolIfSameReference(symbol, localSymbol); }) : undefined;
                    var diagnostic = exportedSymbol ? error(name, ts.Diagnostics.Module_0_declares_1_locally_but_it_is_exported_as_2, moduleName, declarationName, symbolToString(exportedSymbol)) :
                        error(name, ts.Diagnostics.Module_0_declares_1_locally_but_it_is_not_exported, moduleName, declarationName);
                    ts.addRelatedInfo.apply(void 0, __spreadArrays([diagnostic], ts.map(localSymbol.declarations, function (decl, index) {
                        return ts.createDiagnosticForNode(decl, index === 0 ? ts.Diagnostics._0_is_declared_here : ts.Diagnostics.and_here, declarationName);
                    })));
                }
            }
            else {
                error(name, ts.Diagnostics.Module_0_has_no_exported_member_1, moduleName, declarationName);
            }
        }
