class __C__ {
    def_to_moz(AST_Import, function To_Moz_ImportDeclaration(M) {
        var specifiers = [];
        if (M.imported_name) {
            specifiers.push({
                type: "ImportDefaultSpecifier",
                local: to_moz(M.imported_name)
            });
        }
        if (M.imported_names) {
            var first_imported_foreign_name = M.imported_names[0].foreign_name;
            if (first_imported_foreign_name.name === "*" && !first_imported_foreign_name.quote) {
                specifiers.push({
                    type: "ImportNamespaceSpecifier",
                    local: to_moz(M.imported_names[0].name)
                });
            } else {
                M.imported_names.forEach(function(name_mapping) {
                    specifiers.push({
                        type: "ImportSpecifier",
                        local: to_moz(name_mapping.name),
                        imported: to_moz(name_mapping.foreign_name)
                    });
                });
            }
        }
        return {
            type: "ImportDeclaration",
            specifiers: specifiers,
            source: to_moz(M.module_name),
            attributes: import_attributes_to_moz(M.attributes)
        };
    });

}
