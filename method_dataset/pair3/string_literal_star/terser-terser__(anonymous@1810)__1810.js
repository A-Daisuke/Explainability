class __C__ {
    DEFPRINT(AST_NameMapping, function(self, output) {
        var is_import = output.parent() instanceof AST_Import;
        var definition = self.name.definition();
        var foreign_name = self.foreign_name;
        var names_are_different =
            (definition && definition.mangled_name || self.name.name) !==
            foreign_name.name;
        if (!names_are_different &&
            foreign_name.name === "*" &&
            !!foreign_name.quote != !!self.name.quote) {
                // export * as "*"
            names_are_different = true;
        }
        var foreign_name_is_name = !foreign_name.quote;
        if (names_are_different) {
            if (is_import) {
                if (foreign_name_is_name) {
                    output.print(foreign_name.name);
                } else {
                    output.print_string(foreign_name.name, foreign_name.quote);
                }
            } else {
                if (!self.name.quote) {
                    self.name.print(output);
                } else {
                    output.print_string(self.name.name, self.name.quote);
                }
                
            }
            output.space();
            output.print("as");
            output.space();
            if (is_import) {
                self.name.print(output);
            } else {
                if (foreign_name_is_name) {
                    output.print(foreign_name.name);
                } else {
                    output.print_string(foreign_name.name, foreign_name.quote);
                }
            }
        } else {
            if (!self.name.quote) {
                self.name.print(output);
            } else {
                output.print_string(self.name.name, self.name.quote);
            }
        }
    });

}
