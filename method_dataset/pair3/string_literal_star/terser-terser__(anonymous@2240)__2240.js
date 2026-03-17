function __method_wrapper__() {
def_optimize(AST_Binary, function(self, compressor) {
    function reversible() {
        return self.left.is_constant()
            || self.right.is_constant()
            || !self.left.has_side_effects(compressor)
                && !self.right.has_side_effects(compressor);
    }
    function reverse(op) {
        if (reversible()) {
            if (op) self.operator = op;
            var tmp = self.left;
            self.left = self.right;
            self.right = tmp;
        }
    }
    if (compressor.option("lhs_constants") && commutativeOperators.has(self.operator)) {
        if (self.right.is_constant()
            && !self.left.is_constant()) {
            // if right is a constant, whatever side effects the
            // left side might have could not influence the
            // result.  hence, force switch.

            if (!(self.left instanceof AST_Binary
                  && PRECEDENCE[self.left.operator] >= PRECEDENCE[self.operator])) {
                reverse();
            }
        }
    }
    self = self.lift_sequences(compressor);
    if (compressor.option("comparisons")) switch (self.operator) {
      case "===":
      case "!==":
        var is_strict_comparison = true;
        if (
            (self.left.is_string(compressor) && self.right.is_string(compressor)) ||
            (self.left.is_number(compressor) && self.right.is_number(compressor)) ||
            (self.left.is_bigint(compressor) && self.right.is_bigint(compressor)) ||
            (self.left.is_boolean() && self.right.is_boolean()) ||
            self.left.equivalent_to(self.right)
        ) {
            self.operator = self.operator.substr(0, 2);
        }

        // XXX: intentionally falling down to the next case
      case "==":
      case "!=":
        // void 0 == x => null == x
        if (!is_strict_comparison && is_undefined(self.left, compressor)) {
            self.left = make_node(AST_Null, self.left);
        // x == void 0 => x == null
        } else if (!is_strict_comparison && is_undefined(self.right, compressor)) {
            self.right = make_node(AST_Null, self.right);
        } else if (compressor.option("typeofs")
            // "undefined" == typeof x => undefined === x
            && self.left instanceof AST_String
            && self.left.value == "undefined"
            && self.right instanceof AST_UnaryPrefix
            && self.right.operator == "typeof") {
            var expr = self.right.expression;
            if (expr instanceof AST_SymbolRef ? expr.is_declared(compressor)
                : !(expr instanceof AST_PropAccess && compressor.option("ie8"))) {
                self.right = expr;
                self.left = make_node(AST_Undefined, self.left).optimize(compressor);
                if (self.operator.length == 2) self.operator += "=";
            }
        } else if (compressor.option("typeofs")
            // typeof x === "undefined" => x === undefined
            && self.left instanceof AST_UnaryPrefix
            && self.left.operator == "typeof"
            && self.right instanceof AST_String
            && self.right.value == "undefined") {
            var expr = self.left.expression;
            if (expr instanceof AST_SymbolRef ? expr.is_declared(compressor)
                : !(expr instanceof AST_PropAccess && compressor.option("ie8"))) {
                self.left = expr;
                self.right = make_node(AST_Undefined, self.right).optimize(compressor);
                if (self.operator.length == 2) self.operator += "=";
            }
        } else if (self.left instanceof AST_SymbolRef
            // obj !== obj => false
            && self.right instanceof AST_SymbolRef
            && self.left.definition() === self.right.definition()
            && is_object(self.left.fixed_value())) {
            return make_node(self.operator[0] == "=" ? AST_True : AST_False, self);
        } else if (self.left.is_32_bit_integer(compressor) && self.right.is_32_bit_integer(compressor)) {
            const not = node => make_node(AST_UnaryPrefix, node, {
                operator: "!",
                expression: node
            });
            const booleanify = (node, truthy) => {
                if (truthy) {
                    return compressor.in_boolean_context()
                        ? node
                        : not(not(node));
                } else {
                    return not(node);
                }
            };

            // The only falsy 32-bit integer is 0
            if (self.left instanceof AST_Number && self.left.value === 0) {
                return booleanify(self.right, self.operator[0] === "!");
            }
            if (self.right instanceof AST_Number && self.right.value === 0) {
                return booleanify(self.left, self.operator[0] === "!");
            }

            // Mask all-bits check
            // (x & 0xFF) != 0xFF => !(~x & 0xFF)
            let and_op, x, mask;
            if (
                (and_op =
                    self.left instanceof AST_Binary ? self.left
                    : self.right instanceof AST_Binary ? self.right : null)
                && (mask = and_op === self.left ? self.right : self.left)
                && and_op.operator === "&"
                && mask instanceof AST_Number
                && mask.is_32_bit_integer(compressor)
                && (x =
                    and_op.left.equivalent_to(mask) ? and_op.right
                    : and_op.right.equivalent_to(mask) ? and_op.left : null)
            ) {
                let optimized = booleanify(make_node(AST_Binary, self, {
                    operator: "&",
                    left: mask,
                    right: make_node(AST_UnaryPrefix, self, {
                        operator: "~",
                        expression: x
                    })
                }), self.operator[0] === "!");

                return best_of(compressor, optimized, self);
            }
        }
        break;
      case "&&":
      case "||":
        var lhs = self.left;
        if (lhs.operator == self.operator) {
            lhs = lhs.right;
        }
        if (lhs instanceof AST_Binary
            && lhs.operator == (self.operator == "&&" ? "!==" : "===")
            && self.right instanceof AST_Binary
            && lhs.operator == self.right.operator
            && (is_undefined(lhs.left, compressor) && self.right.left instanceof AST_Null
                || lhs.left instanceof AST_Null && is_undefined(self.right.left, compressor))
            && !lhs.right.has_side_effects(compressor)
            && lhs.right.equivalent_to(self.right.right)) {
            var combined = make_node(AST_Binary, self, {
                operator: lhs.operator.slice(0, -1),
                left: make_node(AST_Null, self),
                right: lhs.right
            });
            if (lhs !== self.left) {
                combined = make_node(AST_Binary, self, {
                    operator: self.operator,
                    left: self.left.left,
                    right: combined
                });
            }
            return combined;
        }
        break;
    }
    if (self.operator == "+" && compressor.in_boolean_context()) {
        var ll = self.left.evaluate(compressor);
        var rr = self.right.evaluate(compressor);
        if (ll && typeof ll == "string") {
            return make_sequence(self, [
                self.right,
                make_node(AST_True, self)
            ]).optimize(compressor);
        }
        if (rr && typeof rr == "string") {
            return make_sequence(self, [
                self.left,
                make_node(AST_True, self)
            ]).optimize(compressor);
        }
    }
    if (compressor.option("comparisons") && self.is_boolean()) {
        if (!(compressor.parent() instanceof AST_Binary)
            || compressor.parent() instanceof AST_Assign) {
            var negated = make_node(AST_UnaryPrefix, self, {
                operator: "!",
                expression: self.negate(compressor, first_in_statement(compressor))
            });
            self = best_of(compressor, self, negated);
        }
        if (compressor.option("unsafe_comps")) {
            switch (self.operator) {
              case "<": reverse(">"); break;
              case "<=": reverse(">="); break;
            }
        }
    }
    if (self.operator == "+") {
        if (self.right instanceof AST_String
            && self.right.getValue() == ""
            && self.left.is_string(compressor)) {
            return self.left;
        }
        if (self.left instanceof AST_String
            && self.left.getValue() == ""
            && self.right.is_string(compressor)) {
            return self.right;
        }
        if (self.left instanceof AST_Binary
            && self.left.operator == "+"
            && self.left.left instanceof AST_String
            && self.left.left.getValue() == ""
            && self.right.is_string(compressor)) {
            self.left = self.left.right;
            return self;
        }
    }
    if (compressor.option("evaluate")) {
        switch (self.operator) {
          case "&&":
            var ll = has_flag(self.left, TRUTHY)
                ? true
                : has_flag(self.left, FALSY)
                    ? false
                    : self.left.evaluate(compressor);
            if (!ll) {
                return maintain_this_binding(compressor.parent(), compressor.self(), self.left).optimize(compressor);
            } else if (!(ll instanceof AST_Node)) {
                return make_sequence(self, [ self.left, self.right ]).optimize(compressor);
            }
            var rr = self.right.evaluate(compressor);
            if (!rr) {
                if (compressor.in_boolean_context()) {
                    return make_sequence(self, [
                        self.left,
                        make_node(AST_False, self)
                    ]).optimize(compressor);
                } else {
                    set_flag(self, FALSY);
                }
            } else if (!(rr instanceof AST_Node)) {
                var parent = compressor.parent();
                if (parent.operator == "&&" && parent.left === compressor.self() || compressor.in_boolean_context()) {
                    return self.left.optimize(compressor);
                }
            }
            // x || false && y ---> x ? y : false
            if (self.left.operator == "||") {
                var lr = self.left.right.evaluate(compressor);
                if (!lr) return make_node(AST_Conditional, self, {
                    condition: self.left.left,
                    consequent: self.right,
                    alternative: self.left.right
                }).optimize(compressor);
            }
            break;
          case "||":
            var ll = has_flag(self.left, TRUTHY)
              ? true
              : has_flag(self.left, FALSY)
                ? false
                : self.left.evaluate(compressor);
            if (!ll) {
                return make_sequence(self, [ self.left, self.right ]).optimize(compressor);
            } else if (!(ll instanceof AST_Node)) {
                return maintain_this_binding(compressor.parent(), compressor.self(), self.left).optimize(compressor);
            }
            var rr = self.right.evaluate(compressor);
            if (!rr) {
                var parent = compressor.parent();
                if (parent.operator == "||" && parent.left === compressor.self() || compressor.in_boolean_context()) {
                    return self.left.optimize(compressor);
                }
            } else if (!(rr instanceof AST_Node)) {
                if (compressor.in_boolean_context()) {
                    return make_sequence(self, [
                        self.left,
                        make_node(AST_True, self)
                    ]).optimize(compressor);
                } else {
                    set_flag(self, TRUTHY);
                }
            }
            if (self.left.operator == "&&") {
                var lr = self.left.right.evaluate(compressor);
                if (lr && !(lr instanceof AST_Node)) return make_node(AST_Conditional, self, {
                    condition: self.left.left,
                    consequent: self.left.right,
                    alternative: self.right
                }).optimize(compressor);
            }
            break;
          case "??":
            if (is_nullish(self.left, compressor)) {
                return self.right;
            }

            var ll = self.left.evaluate(compressor);
            if (!(ll instanceof AST_Node)) {
                // if we know the value for sure we can simply compute right away.
                return ll == null ? self.right : self.left;
            }

            if (compressor.in_boolean_context()) {
                const rr = self.right.evaluate(compressor);
                if (!(rr instanceof AST_Node) && !rr) {
                    return self.left;
                }
            }
        }
        var associative = true;
        switch (self.operator) {
          case "+":
            // (x + "foo") + "bar" => x + "foobar"
            if (self.right instanceof AST_Constant
                && self.left instanceof AST_Binary
                && self.left.operator == "+"
                && self.left.is_string(compressor)) {
                var binary = make_node(AST_Binary, self, {
                    operator: "+",
                    left: self.left.right,
                    right: self.right,
                });
                var r = binary.optimize(compressor);
                if (binary !== r) {
                    self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: self.left.left,
                        right: r
                    });
                }
            }
            // (x + "foo") + ("bar" + y) => (x + "foobar") + y
            if (self.left instanceof AST_Binary
                && self.left.operator == "+"
                && self.left.is_string(compressor)
                && self.right instanceof AST_Binary
                && self.right.operator == "+"
                && self.right.is_string(compressor)) {
                var binary = make_node(AST_Binary, self, {
                    operator: "+",
                    left: self.left.right,
                    right: self.right.left,
                });
                var m = binary.optimize(compressor);
                if (binary !== m) {
                    self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: make_node(AST_Binary, self.left, {
                            operator: "+",
                            left: self.left.left,
                            right: m
                        }),
                        right: self.right.right
                    });
                }
            }
            // a + -b => a - b
            if (self.right instanceof AST_UnaryPrefix
                && self.right.operator == "-"
                && self.left.is_number_or_bigint(compressor)) {
                self = make_node(AST_Binary, self, {
                    operator: "-",
                    left: self.left,
                    right: self.right.expression
                });
                break;
            }
            // -a + b => b - a
            if (self.left instanceof AST_UnaryPrefix
                && self.left.operator == "-"
                && reversible()
                && self.right.is_number_or_bigint(compressor)) {
                self = make_node(AST_Binary, self, {
                    operator: "-",
                    left: self.right,
                    right: self.left.expression
                });
                break;
            }
            // `foo${bar}baz` + 1 => `foo${bar}baz1`
            if (self.left instanceof AST_TemplateString) {
                var l = self.left;
                var r = self.right.evaluate(compressor);
                if (r != self.right) {
                    l.segments[l.segments.length - 1].value += String(r);
                    return l;
                }
            }
            // 1 + `foo${bar}baz` => `1foo${bar}baz`
            if (self.right instanceof AST_TemplateString) {
                var r = self.right;
                var l = self.left.evaluate(compressor);
                if (l != self.left) {
                    r.segments[0].value = String(l) + r.segments[0].value;
                    return r;
                }
            }
            // `1${bar}2` + `foo${bar}baz` => `1${bar}2foo${bar}baz`
            if (self.left instanceof AST_TemplateString
                && self.right instanceof AST_TemplateString) {
                var l = self.left;
                var segments = l.segments;
                var r = self.right;
                segments[segments.length - 1].value += r.segments[0].value;
                for (var i = 1; i < r.segments.length; i++) {
                    segments.push(r.segments[i]);
                }
                return l;
            }
          case "*":
            associative = compressor.option("unsafe_math");
          case "&":
          case "|":
          case "^":
            // a + +b => +b + a
            if (
                self.left.is_number_or_bigint(compressor)
                && self.right.is_number_or_bigint(compressor)
                && reversible()
                && !(self.left instanceof AST_Binary
                    && self.left.operator != self.operator
                    && PRECEDENCE[self.left.operator] >= PRECEDENCE[self.operator])) {
                var reversed = make_node(AST_Binary, self, {
                    operator: self.operator,
                    left: self.right,
                    right: self.left
                });
                if (self.right instanceof AST_Constant
                    && !(self.left instanceof AST_Constant)) {
                    self = best_of(compressor, reversed, self);
                } else {
                    self = best_of(compressor, self, reversed);
                }
            }
            if (associative && self.is_number_or_bigint(compressor)) {
                // a + (b + c) => (a + b) + c
                if (self.right instanceof AST_Binary
                    && self.right.operator == self.operator) {
                    self = make_node(AST_Binary, self, {
                        operator: self.operator,
                        left: make_node(AST_Binary, self.left, {
                            operator: self.operator,
                            left: self.left,
                            right: self.right.left,
                            start: self.left.start,
                            end: self.right.left.end
                        }),
                        right: self.right.right
                    });
                }
                // (n + 2) + 3 => 5 + n
                // (2 * n) * 3 => 6 + n
                if (self.right instanceof AST_Constant
                    && self.left instanceof AST_Binary
                    && self.left.operator == self.operator) {
                    if (self.left.left instanceof AST_Constant) {
                        self = make_node(AST_Binary, self, {
                            operator: self.operator,
                            left: make_node(AST_Binary, self.left, {
                                operator: self.operator,
                                left: self.left.left,
                                right: self.right,
                                start: self.left.left.start,
                                end: self.right.end
                            }),
                            right: self.left.right
                        });
                    } else if (self.left.right instanceof AST_Constant) {
                        self = make_node(AST_Binary, self, {
                            operator: self.operator,
                            left: make_node(AST_Binary, self.left, {
                                operator: self.operator,
                                left: self.left.right,
                                right: self.right,
                                start: self.left.right.start,
                                end: self.right.end
                            }),
                            right: self.left.left
                        });
                    }
                }
                // (a | 1) | (2 | d) => (3 | a) | b
                if (self.left instanceof AST_Binary
                    && self.left.operator == self.operator
                    && self.left.right instanceof AST_Constant
                    && self.right instanceof AST_Binary
                    && self.right.operator == self.operator
                    && self.right.left instanceof AST_Constant) {
                    self = make_node(AST_Binary, self, {
                        operator: self.operator,
                        left: make_node(AST_Binary, self.left, {
                            operator: self.operator,
                            left: make_node(AST_Binary, self.left.left, {
                                operator: self.operator,
                                left: self.left.right,
                                right: self.right.left,
                                start: self.left.right.start,
                                end: self.right.left.end
                            }),
                            right: self.left.left
                        }),
                        right: self.right.right
                    });
                }
            }
        }

        // bitwise ops
        if (bitwise_binop.has(self.operator)) {
            // Use De Morgan's laws
            // z & (X | y)
            // => z & X (given y & z === 0)
            // => z & X | {y & z} (given y & z !== 0)
            let y, z, x_node, y_node, z_node = self.left;
            if (
                self.operator === "&"
                && self.right instanceof AST_Binary
                && self.right.operator === "|"
                && typeof (z = self.left.evaluate(compressor)) === "number"
            ) {
                if (typeof (y = self.right.right.evaluate(compressor)) === "number") {
                    // z & (X | y)
                    x_node = self.right.left;
                    y_node = self.right.right;
                } else if (typeof (y = self.right.left.evaluate(compressor)) === "number") {
                    // z & (y | X)
                    x_node = self.right.right;
                    y_node = self.right.left;
                }

                if (x_node && y_node) {
                    if ((y & z) === 0) {
                        self = make_node(AST_Binary, self, {
                            operator: self.operator,
                            left: z_node,
                            right: x_node
                        });
                    } else {
                        const reordered_ops = make_node(AST_Binary, self, {
                            operator: "|",
                            left: make_node(AST_Binary, self, {
                                operator: "&",
                                left: x_node,
                                right: z_node
                            }),
                            right: make_node_from_constant(y & z, y_node),
                        });

                        self = best_of(compressor, self, reordered_ops);
                    }
                }
            }

            // x | x => 0 | x
            // x & x => 0 | x
            if (
                (self.operator === "|" || self.operator === "&")
                && self.left.equivalent_to(self.right)
                && !self.left.has_side_effects(compressor)
                && compressor.in_32_bit_context(true)
            ) {
                self.left = make_node(AST_Number, self, { value: 0 });
                self.operator = "|";
            }

            // ~x ^ ~y => x ^ y
            if (
                self.operator === "^"
                && self.left instanceof AST_UnaryPrefix
                && self.left.operator === "~"
                && self.right instanceof AST_UnaryPrefix
                && self.right.operator === "~"
            ) {
                self = make_node(AST_Binary, self, {
                    operator: "^",
                    left: self.left.expression,
                    right: self.right.expression
                });
            }


            // Shifts that do nothing
            // {anything} >> 0 => {anything} | 0
            // {anything} << 0 => {anything} | 0
            if (
                (self.operator === "<<" || self.operator === ">>")
                && self.right instanceof AST_Number && self.right.value === 0
            ) {
                self.operator = "|";
            }

            // Find useless to-bitwise conversions
            // {32 bit integer} | 0 => {32 bit integer}
            // {32 bit integer} ^ 0 => {32 bit integer}
            const zero_side = self.right instanceof AST_Number && self.right.value === 0 ? self.right
                : self.left instanceof AST_Number && self.left.value === 0 ? self.left
                : null;
            const non_zero_side = zero_side && (zero_side === self.right ? self.left : self.right);
            if (
                zero_side
                && (self.operator === "|" || self.operator === "^")
                && (non_zero_side.is_32_bit_integer(compressor) || compressor.in_32_bit_context(true))
            ) {
                return non_zero_side;
            }

            // {anything} & 0 => 0
            if (
                zero_side
                && self.operator === "&"
                && !non_zero_side.has_side_effects(compressor)
                && non_zero_side.is_32_bit_integer(compressor)
            ) {
                return zero_side;
            }

            // ~0 is all ones, as well as -1.
            // We can ellide some operations with it.
            const is_full_mask = (node) =>
                node instanceof AST_Number && node.value === -1
                ||
                    node instanceof AST_UnaryPrefix
                    && node.operator === "-"
                    && node.expression instanceof AST_Number
                    && node.expression.value === 1;

            const full_mask = is_full_mask(self.right) ? self.right
                : is_full_mask(self.left) ? self.left
                : null;
            const other_side = (full_mask === self.right ? self.left : self.right);

            // {32 bit integer} & -1 => {32 bit integer}
            if (
                full_mask
                && self.operator === "&"
                && (
                    other_side.is_32_bit_integer(compressor)
                    || compressor.in_32_bit_context(true)
                )
            ) {
                return other_side;
            }

            // {anything} ^ -1 => ~{anything}
            if (
                full_mask
                && self.operator === "^"
                && (
                    other_side.is_32_bit_integer(compressor)
                    || compressor.in_32_bit_context(true)
                )
            ) {
                return other_side.bitwise_negate(compressor);
            }
        }
    }
    // x && (y && z)  ==>  x && y && z
    // x || (y || z)  ==>  x || y || z
    // x + ("y" + z)  ==>  x + "y" + z
    // "x" + (y + "z")==>  "x" + y + "z"
    if (self.right instanceof AST_Binary
        && self.right.operator == self.operator
        && (lazy_op.has(self.operator)
            || (self.operator == "+"
                && (self.right.left.is_string(compressor)
                    || (self.left.is_string(compressor)
                        && self.right.right.is_string(compressor)))))
    ) {
        self.left = make_node(AST_Binary, self.left, {
            operator : self.operator,
            left     : self.left.transform(compressor),
            right    : self.right.left.transform(compressor)
        });
        self.right = self.right.right.transform(compressor);
        return self.transform(compressor);
    }
    var ev = self.evaluate(compressor);
    if (ev !== self) {
        ev = make_node_from_constant(ev, self).optimize(compressor);
        return best_of(compressor, ev, self);
    }
    return self;
});

}
