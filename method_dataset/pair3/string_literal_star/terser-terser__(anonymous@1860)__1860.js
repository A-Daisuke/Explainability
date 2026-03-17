class __C__ {
    DEFPRINT(AST_Export, function(self, output) {
        output.print("export");
        output.space();
        if (self.is_default) {
            output.print("default");
            output.space();
        }
        if (self.exported_names) {
            if (self.exported_names.length === 1 &&
                self.exported_names[0].name.name === "*" &&
                !self.exported_names[0].name.quote) {
                    self.exported_names[0].print(output);
            } else {
                output.print("{");
                self.exported_names.forEach(function(name_export, i) {
                    output.space();
                    name_export.print(output);
                    if (i < self.exported_names.length - 1) {
                        output.print(",");
                    }
                });
                output.space();
                output.print("}");
            }
        } else if (self.exported_value) {
            self.exported_value.print(output);
        } else if (self.exported_definition) {
            self.exported_definition.print(output);
            if (self.exported_definition instanceof AST_Definitions) return;
        }
        if (self.module_name) {
            output.space();
            output.print("from");
            output.space();
            self.module_name.print(output);
        }
        if (self.attributes) {
            output.print("with");
            self.attributes.print(output);
        }
        if (self.exported_value
                && !(self.exported_value instanceof AST_Defun ||
                    self.exported_value instanceof AST_Function ||
                    self.exported_value instanceof AST_Class)
            || self.module_name
            || self.exported_names
        ) {
            output.semicolon();
        }
    });

}
