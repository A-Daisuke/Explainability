    var function_ = function(ctor, is_generator, is_async, is_export_default) {
        var in_statement = ctor === AST_Defun;
        if (is("operator", "*")) {
            is_generator = true;
            next();
        }

        var name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : AST_SymbolLambda) : null;
        if (in_statement && !name) {
            if (is_export_default) {
                ctor = AST_Function;
            } else {
                unexpected();
            }
        }

        if (name && ctor !== AST_Accessor && !(name instanceof AST_SymbolDeclaration))
            unexpected(prev());

        var args = [];
        var body = _function_body(true, is_generator, is_async, name, args);
        return new ctor({
            start : args.start,
            end   : body.end,
            is_generator: is_generator,
            async : is_async,
            name  : name,
            argnames: args,
            body  : body
        });
    };
