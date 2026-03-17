class __C__ {
def_eval(AST_Call, function (compressor, depth) {
    var exp = this.expression;

    const callee = exp._eval(compressor, depth);
    if (callee === nullish || (this.optional && callee == null)) return nullish;

    if (compressor.option("unsafe") && exp instanceof AST_PropAccess) {
        var key = exp.property;
        if (key instanceof AST_Node) {
            key = key._eval(compressor, depth);
            if (key === exp.property)
                return this;
        }
        var val;
        var e = exp.expression;
        if (is_undeclared_ref(e)) {
            var first_arg = e.name === "hasOwnProperty" &&
                key === "call" &&
                (this.args[0] && this.args[0].evaluate(compressor));

            first_arg = first_arg instanceof AST_Dot ? first_arg.expression : first_arg;

            if ((first_arg == null || first_arg.thedef && first_arg.thedef.undeclared)) {
                return this.clone();
            }
            if (!is_pure_native_fn(e.name, key)) return this;
            val = global_objs[e.name];
        } else {
            val = e._eval(compressor, depth + 1);
            if (val === e || !val)
                return this;
            if (!is_pure_native_method(val.constructor.name, key))
                return this;
        }
        var args = [];
        for (var i = 0, len = this.args.length; i < len; i++) {
            var arg = this.args[i];
            var value = arg._eval(compressor, depth);
            if (arg === value)
                return this;
            if (arg instanceof AST_Lambda)
                return this;
            args.push(value);
        }
        try {
            return val[key].apply(val, args);
        } catch (ex) {
            // We don't really care
        }
    }
    return this;
});

}
