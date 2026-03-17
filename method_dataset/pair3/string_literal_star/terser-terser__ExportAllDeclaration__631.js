const __obj__ = {
        ExportAllDeclaration: function(M) {
            var foreign_name = M.exported == null ?
                new AST_SymbolExportForeign({ name: "*" }) :
                from_moz_symbol(AST_SymbolExportForeign, M.exported, M.exported.type === "Literal");
            return new AST_Export({
                start: my_start_token(M),
                end: my_end_token(M),
                exported_names: [
                    new AST_NameMapping({
                        start: my_start_token(M),
                        end: my_end_token(M),
                        name: new AST_SymbolExport({ name: "*" }),
                        foreign_name: foreign_name
                    })
                ],
                module_name: from_moz(M.source),
                attributes: import_attributes_from_moz(M.attributes || M.assertions)
            });
        },

};
