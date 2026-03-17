    function _yield_expression() {
        var start = S.token;
        var star = false;
        var has_expression = true;

        // Attempt to get expression or star (and then the mandatory expression)
        // behind yield on the same line.
        //
        // If nothing follows on the same line of the yieldExpression,
        // it should default to the value `undefined` for yield to return.
        // In that case, the `undefined` stored as `null` in ast.
        //
        // Note 1: It isn't allowed for yield* to close without an expression
        // Note 2: If there is a nlb between yield and star, it is interpret as
        //         yield <explicit undefined> <inserted automatic semicolon> *
        if (
            can_insert_semicolon()
            || is("punc") && PUNC_AFTER_EXPRESSION.has(S.token.value)
            || is("template_cont")
        ) {
            has_expression = false;
        } else if (is("operator", "*")) {
            star = true;
            next();
        }

        return new AST_Yield({
            start      : start,
            is_star    : star,
            expression : has_expression ? expression() : null,
            end        : prev()
        });
    }
