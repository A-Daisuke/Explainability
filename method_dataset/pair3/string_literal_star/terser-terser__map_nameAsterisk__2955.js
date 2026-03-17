    function map_nameAsterisk(is_import, import_or_export_foreign_name) {
        var foreign_type = is_import ? AST_SymbolImportForeign : AST_SymbolExportForeign;
        var type = is_import ? AST_SymbolImport : AST_SymbolExport;
        var start = S.token;
        var name, foreign_name;
        var end = prev();

        if (is_import) {
            name = import_or_export_foreign_name;
        } else {
            foreign_name = import_or_export_foreign_name;
        }

        name = name || new type({
            start: start,
            name: "*",
            end: end,
        });

        foreign_name = foreign_name || new foreign_type({
            start: start,
            name: "*",
            end: end,
        });

        return new AST_NameMapping({
            start: start,
            foreign_name: foreign_name,
            name: name,
            end: end,
        });
    }
