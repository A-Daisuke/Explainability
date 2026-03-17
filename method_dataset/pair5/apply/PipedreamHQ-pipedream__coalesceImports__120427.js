        function coalesceImports(importGroup) {
            var _a;
            if (importGroup.length === 0) {
                return importGroup;
            }
            var _b = getCategorizedImports(importGroup), importWithoutClause = _b.importWithoutClause, typeOnlyImports = _b.typeOnlyImports, regularImports = _b.regularImports;
            var coalescedImports = [];
            if (importWithoutClause) {
                coalescedImports.push(importWithoutClause);
            }
            for (var _i = 0, _c = [regularImports, typeOnlyImports]; _i < _c.length; _i++) {
                var group_2 = _c[_i];
                var isTypeOnly = group_2 === typeOnlyImports;
                var defaultImports = group_2.defaultImports, namespaceImports = group_2.namespaceImports, namedImports = group_2.namedImports;
                // Normally, we don't combine default and namespace imports, but it would be silly to
                // produce two import declarations in this special case.
                if (!isTypeOnly && defaultImports.length === 1 && namespaceImports.length === 1 && namedImports.length === 0) {
                    // Add the namespace import to the existing default ImportDeclaration.
                    var defaultImport = defaultImports[0];
                    coalescedImports.push(updateImportDeclarationAndClause(defaultImport, defaultImport.importClause.name, namespaceImports[0].importClause.namedBindings)); // TODO: GH#18217
                    continue;
                }
                var sortedNamespaceImports = ts.stableSort(namespaceImports, function (i1, i2) {
                    return compareIdentifiers(i1.importClause.namedBindings.name, i2.importClause.namedBindings.name);
                }); // TODO: GH#18217
                for (var _d = 0, sortedNamespaceImports_1 = sortedNamespaceImports; _d < sortedNamespaceImports_1.length; _d++) {
                    var namespaceImport = sortedNamespaceImports_1[_d];
                    // Drop the name, if any
                    coalescedImports.push(updateImportDeclarationAndClause(namespaceImport, /*name*/ undefined, namespaceImport.importClause.namedBindings)); // TODO: GH#18217
                }
                if (defaultImports.length === 0 && namedImports.length === 0) {
                    continue;
                }
                var newDefaultImport = void 0;
                var newImportSpecifiers = [];
                if (defaultImports.length === 1) {
                    newDefaultImport = defaultImports[0].importClause.name;
                }
                else {
                    for (var _e = 0, defaultImports_1 = defaultImports; _e < defaultImports_1.length; _e++) {
                        var defaultImport = defaultImports_1[_e];
                        newImportSpecifiers.push(ts.createImportSpecifier(ts.createIdentifier("default"), defaultImport.importClause.name)); // TODO: GH#18217
                    }
                }
                newImportSpecifiers.push.apply(newImportSpecifiers, ts.flatMap(namedImports, function (i) { return i.importClause.namedBindings.elements; })); // TODO: GH#18217
                var sortedImportSpecifiers = sortSpecifiers(newImportSpecifiers);
                var importDecl = defaultImports.length > 0
                    ? defaultImports[0]
                    : namedImports[0];
                var newNamedImports = sortedImportSpecifiers.length === 0
                    ? newDefaultImport
                        ? undefined
                        : ts.createNamedImports(ts.emptyArray)
                    : namedImports.length === 0
                        ? ts.createNamedImports(sortedImportSpecifiers)
                        : ts.updateNamedImports(namedImports[0].importClause.namedBindings, sortedImportSpecifiers); // TODO: GH#18217
                // Type-only imports are not allowed to mix default, namespace, and named imports in any combination.
                // We could rewrite a default import as a named import (`import { default as name }`), but we currently
                // choose not to as a stylistic preference.
                if (isTypeOnly && newDefaultImport && newNamedImports) {
                    coalescedImports.push(updateImportDeclarationAndClause(importDecl, newDefaultImport, /*namedBindings*/ undefined));
                    coalescedImports.push(updateImportDeclarationAndClause((_a = namedImports[0]) !== null && _a !== void 0 ? _a : importDecl, /*name*/ undefined, newNamedImports));
                }
                else {
                    coalescedImports.push(updateImportDeclarationAndClause(importDecl, newDefaultImport, newNamedImports));
                }
            }
            return coalescedImports;
        }
