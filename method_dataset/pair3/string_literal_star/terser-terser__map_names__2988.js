    function map_names(is_import) {
        var names;
        if (is("punc", "{")) {
            next();
            names = [];
            while (!is("punc", "}")) {
                names.push(map_name(is_import));
                if (is("punc", ",")) {
                    next();
                }
            }
            next();
        } else if (is("operator", "*")) {
            var name;
            next();
            if (is("name", "as")) {
                next();  // The "as" word
                name = is_import ? as_symbol(AST_SymbolImport) : as_symbol_or_string(AST_SymbolExportForeign);
            }
            names = [map_nameAsterisk(is_import, name)];
        }
        return names;
    }
