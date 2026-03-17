        function coalesceExports(exportGroup) {
            if (exportGroup.length === 0) {
                return exportGroup;
            }
            var _a = getCategorizedExports(exportGroup), exportWithoutClause = _a.exportWithoutClause, namedExports = _a.namedExports, typeOnlyExports = _a.typeOnlyExports;
            var coalescedExports = [];
            if (exportWithoutClause) {
                coalescedExports.push(exportWithoutClause);
            }
            for (var _i = 0, _b = [namedExports, typeOnlyExports]; _i < _b.length; _i++) {
                var exportGroup_1 = _b[_i];
                if (exportGroup_1.length === 0) {
                    continue;
                }
                var newExportSpecifiers = [];
                newExportSpecifiers.push.apply(newExportSpecifiers, ts.flatMap(exportGroup_1, function (i) { return i.exportClause && ts.isNamedExports(i.exportClause) ? i.exportClause.elements : ts.emptyArray; }));
                var sortedExportSpecifiers = sortSpecifiers(newExportSpecifiers);
                var exportDecl = exportGroup_1[0];
                coalescedExports.push(ts.updateExportDeclaration(exportDecl, exportDecl.decorators, exportDecl.modifiers, exportDecl.exportClause && (ts.isNamedExports(exportDecl.exportClause) ?
                    ts.updateNamedExports(exportDecl.exportClause, sortedExportSpecifiers) :
                    ts.updateNamespaceExport(exportDecl.exportClause, exportDecl.exportClause.name)), exportDecl.moduleSpecifier, exportDecl.isTypeOnly));
            }
            return coalescedExports;
            /*
             * Returns entire export declarations because they may already have been rewritten and
             * may lack parent pointers.  The desired parts can easily be recovered based on the
             * categorization.
             */
            function getCategorizedExports(exportGroup) {
                var exportWithoutClause;
                var namedExports = [];
                var typeOnlyExports = [];
                for (var _i = 0, exportGroup_2 = exportGroup; _i < exportGroup_2.length; _i++) {
                    var exportDeclaration = exportGroup_2[_i];
                    if (exportDeclaration.exportClause === undefined) {
                        // Only the first such export is interesting - the others are redundant.
                        // Note: Unfortunately, we will lose trivia that was on this node.
                        exportWithoutClause = exportWithoutClause || exportDeclaration;
                    }
                    else if (exportDeclaration.isTypeOnly) {
                        typeOnlyExports.push(exportDeclaration);
                    }
                    else {
                        namedExports.push(exportDeclaration);
                    }
                }
                return {
                    exportWithoutClause: exportWithoutClause,
                    namedExports: namedExports,
                    typeOnlyExports: typeOnlyExports,
                };
            }
        }
