function __method_wrapper__() {
def_optimize(AST_UnaryPrefix, function(self, compressor) {
    var e = self.expression;
    if (
        self.operator == "delete" &&
        !(
            e instanceof AST_SymbolRef ||
            e instanceof AST_PropAccess ||
            e instanceof AST_Chain ||
            is_identifier_atom(e)
        )
    ) {
        return make_sequence(self, [e, make_node(AST_True, self)]).optimize(compressor);
    }
    var seq = self.lift_sequences(compressor);
    if (seq !== self) {
        return seq;
    }
    if (compressor.option("side_effects") && self.operator == "void") {
        e = e.drop_side_effect_free(compressor);
        if (e) {
            self.expression = e;
            return self;
        } else {
            return make_node(AST_Undefined, self).optimize(compressor);
        }
    }
    if (compressor.in_boolean_context()) {
        switch (self.operator) {
          case "!":
            if (e instanceof AST_UnaryPrefix && e.operator == "!") {
                // !!foo ==> foo, if we're in boolean context
                return e.expression;
            }
            if (e instanceof AST_Binary) {
                self = best_of(compressor, self, e.negate(compressor, first_in_statement(compressor)));
            }
            break;
          case "typeof":
            // typeof always returns a non-empty string, thus it's
            // always true in booleans
            // And we don't need to check if it's undeclared, because in typeof, that's OK
            return (e instanceof AST_SymbolRef ? make_node(AST_True, self) : make_sequence(self, [
                e,
                make_node(AST_True, self)
            ])).optimize(compressor);
        }
    }
    if (self.operator == "-" && e instanceof AST_Infinity) {
        e = e.transform(compressor);
    }
    if (e instanceof AST_Binary
        && (self.operator == "+" || self.operator == "-")
        && (e.operator == "*" || e.operator == "/" || e.operator == "%")) {
        return make_node(AST_Binary, self, {
            operator: e.operator,
            left: make_node(AST_UnaryPrefix, e.left, {
                operator: self.operator,
                expression: e.left
            }),
            right: e.right
        });
    }

    if (compressor.option("evaluate")) {
        // ~~x => x (in 32-bit context)
        // ~~{32 bit integer} => {32 bit integer}
        if (
            self.operator === "~"
            && self.expression instanceof AST_UnaryPrefix
            && self.expression.operator === "~"
            && (compressor.in_32_bit_context(false) || self.expression.expression.is_32_bit_integer(compressor))
        ) {
            return self.expression.expression;
        }

        // ~(x ^ y) => x ^ ~y
        if (
            self.operator === "~"
            && e instanceof AST_Binary
            && e.operator === "^"
        ) {
            if (e.left instanceof AST_UnaryPrefix && e.left.operator === "~") {
                // ~(~x ^ y) => x ^ y
                e.left = e.left.bitwise_negate(compressor, true);
            } else {
                e.right = e.right.bitwise_negate(compressor, true);
            }
            return e;
        }
    }

    if (
        self.operator != "-"
        // avoid infinite recursion of numerals
        || !(e instanceof AST_Number || e instanceof AST_Infinity || e instanceof AST_BigInt)
    ) {
        var ev = self.evaluate(compressor);
        if (ev !== self) {
            ev = make_node_from_constant(ev, self).optimize(compressor);
            return best_of(compressor, ev, self);
        }
    }
    return self;
});

}
