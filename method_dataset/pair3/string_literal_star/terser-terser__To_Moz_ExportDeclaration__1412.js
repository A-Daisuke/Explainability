function __method_wrapper__() {
    def_to_moz(AST_Export, function To_Moz_ExportDeclaration(M) {
        if (M.exported_names) {
            var first_exported = M.exported_names[0];
            if (first_exported && first_exported.name.name === "*" && !first_exported.name.quote) {
                var foreign_name = first_exported.foreign_name;
                var exported = foreign_name.name === "*" && !foreign_name.quote
                    ? null
                    : to_moz(foreign_name);
                return {
                    type: "ExportAllDeclaration",
                    source: to_moz(M.module_name),
                    exported: exported,
                    attributes: import_attributes_to_moz(M.attributes)
                };
            }
            return {
                type: "ExportNamedDeclaration",
                specifiers: M.exported_names.map(function (name_mapping) {
                    return {
                        type: "ExportSpecifier",
                        exported: to_moz(name_mapping.foreign_name),
                        local: to_moz(name_mapping.name)
                    };
                }),
                declaration: to_moz(M.exported_definition),
                source: to_moz(M.module_name),
                attributes: import_attributes_to_moz(M.attributes)
            };
        }

        if (M.is_default) {
            return {
                type: "ExportDefaultDeclaration",
                declaration: to_moz(M.exported_value || M.exported_definition),
            };
        } else {
            return {
                type: "ExportNamedDeclaration",
                declaration: to_moz(M.exported_value || M.exported_definition),
                specifiers: [],
                source: null,
            };
        }
    });

}
