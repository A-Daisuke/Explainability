    function object_or_class_property(name, start, is_class) {
        const get_symbol_ast = (name, SymbolClass) => {
            if (typeof name === "string") {
                return new SymbolClass({ start, name, end: prev() });
            } else if (name === null) {
                unexpected();
            }
            return name;
        };

        var is_private = prev().type === "privatename";
        const is_not_method_start = () =>
            !is("punc", "(") && !is("punc", ",") && !is("punc", "}") && !is("punc", ";") && !is("operator", "=") && !is_private;

        var is_async = false;
        var is_static = false;
        var is_generator = false;
        var accessor_type = null;

        if (is_class && name === "static" && is_not_method_start()) {
            const static_block = class_static_block();
            if (static_block != null) {
                return static_block;
            }
            is_static = true;
            name = as_property_name();
        }
        if (name === "async" && is_not_method_start()) {
            is_async = true;
            name = as_property_name();
        }
        if (prev().type === "operator" && prev().value === "*") {
            is_generator = true;
            name = as_property_name();
        }
        if ((name === "get" || name === "set") && is_not_method_start()) {
            accessor_type = name;
            name = as_property_name();
        }
        if (!is_private && prev().type === "privatename") {
            is_private = true;
        }

        const property_token = prev();

        if (accessor_type != null) {
            if (!is_private) {
                const AccessorClass = accessor_type === "get"
                    ? AST_ObjectGetter
                    : AST_ObjectSetter;

                name = get_symbol_ast(name, AST_SymbolMethod);
                return annotate(new AccessorClass({
                    start,
                    static: is_static,
                    key: name,
                    quote: name instanceof AST_SymbolMethod ? property_token.quote : undefined,
                    value: create_accessor(),
                    end: prev()
                }));
            } else {
                const AccessorClass = accessor_type === "get"
                    ? AST_PrivateGetter
                    : AST_PrivateSetter;

                return annotate(new AccessorClass({
                    start,
                    static: is_static,
                    key: get_symbol_ast(name, AST_SymbolMethod),
                    value: create_accessor(),
                    end: prev(),
                }));
            }
        }

        if (is("punc", "(")) {
            name = get_symbol_ast(name, AST_SymbolMethod);
            const AST_MethodVariant = is_private
                ? AST_PrivateMethod
                : AST_ConciseMethod;
            var node = new AST_MethodVariant({
                start       : start,
                static      : is_static,
                key         : name,
                quote       : name instanceof AST_SymbolMethod ?
                              property_token.quote : undefined,
                value       : create_accessor(is_generator, is_async),
                end         : prev()
            });
            return annotate(node);
        }

        if (is_class) {
            const AST_SymbolVariant = is_private
                ? AST_SymbolPrivateProperty
                : AST_SymbolClassProperty;
            const AST_ClassPropertyVariant = is_private
                ? AST_ClassPrivateProperty
                : AST_ClassProperty;

            const key = get_symbol_ast(name, AST_SymbolVariant);
            const quote = key instanceof AST_SymbolClassProperty
                ? property_token.quote
                : undefined;
            if (is("operator", "=")) {
                next();
                return annotate(
                    new AST_ClassPropertyVariant({
                        start,
                        static: is_static,
                        quote,
                        key,
                        value: expression(false),
                        end: prev()
                    })
                );
            } else if (
                is("name")
                || is("privatename")
                || is("punc", "[")
                || is("operator", "*")
                || is("punc", ";")
                || is("punc", "}")
                || is("string")
                || is("num")
                || is("big_int")
            ) {
                return annotate(
                    new AST_ClassPropertyVariant({
                        start,
                        static: is_static,
                        quote,
                        key,
                        end: prev()
                    })
                );
            }
        }
    }
