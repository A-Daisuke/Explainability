function __method_wrapper__() {
    DEFPRINT(AST_Import, function(self, output) {
        output.print("import");
        output.space();
        if (self.imported_name) {
            self.imported_name.print(output);
        }
        if (self.imported_name && self.imported_names) {
            output.print(",");
            output.space();
        }
        if (self.imported_names) {
            if (self.imported_names.length === 1 &&
                self.imported_names[0].foreign_name.name === "*" &&
                !self.imported_names[0].foreign_name.quote) {
                self.imported_names[0].print(output);
            } else {
                output.print("{");
                self.imported_names.forEach(function (name_import, i) {
                    output.space();
                    name_import.print(output);
                    if (i < self.imported_names.length - 1) {
                        output.print(",");
                    }
                });
                output.space();
                output.print("}");
            }
        }
        if (self.imported_name || self.imported_names) {
            output.space();
            output.print("from");
            output.space();
        }
        self.module_name.print(output);
        if (self.attributes) {
            output.print("with");
            self.attributes.print(output);
        }
        output.semicolon();
    });

}
