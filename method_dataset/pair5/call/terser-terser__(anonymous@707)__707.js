function __method_wrapper__() {
    def_is_constant_expression(AST_Class, function(scope) {
        if (this.extends && !this.extends.is_constant_expression(scope)) {
            return false;
        }

        for (const prop of this.properties) {
            if (prop.computed_key() && !prop.key.is_constant_expression(scope)) {
                return false;
            }
            if (prop.static && prop.value && !prop.value.is_constant_expression(scope)) {
                return false;
            }
            if (prop instanceof AST_ClassStaticBlock) {
                return false;
            }
        }

        return all_refs_local.call(this, scope);
    });

}
