        var tw = new AST.TreeWalker(function(node, descend) {
            if (node instanceof AST.AST_Assign) {
                if (!(node.left instanceof AST.AST_SymbolRef)) {
                    croak(node);
                }
                var name = node.left.name;
                test[name] = evaluate(node.right);
                return true;
            }
            if (node instanceof AST.AST_LabeledStatement) {
                var label = node.label;
                assert.ok(
                    [
                        "input",
                        "bad_input",
                        "prepend_code",
                        "expect",
                        "expect_error",
                        "expect_exact",
                        "expect_stdout",
                        "node_version",
                        "no_mozilla_ast",
                        "reminify",
                    ].includes(label.name),
                    tmpl("Unsupported label {name} [{line},{col}]", {
                        name: label.name,
                        line: label.start.line,
                        col: label.start.col
                    })
                );
                var stat = node.body;
                if (label.name == "expect_exact" || label.name == "node_version") {
                    test[label.name] = read_string(stat);
                } else if (label.name == "reminify") {
                    var value = read_boolean(stat);
                    test.reminify = value == null || value;
                } else if (label.name == "expect_stdout") {
                    var body = stat.body;
                    if (body instanceof AST.AST_Boolean) {
                        test[label.name] = body.value;
                    } else if (body instanceof AST.AST_Call) {
                        var ctor = global[body.expression.name];
                        assert.ok(ctor === Error || ctor.prototype instanceof Error, tmpl("Unsupported expect_stdout format [{line},{col}]", {
                            line: label.start.line,
                            col: label.start.col
                        }));
                        test[label.name] = ctor.apply(null, body.args.map(function(node) {
                            assert.ok(node instanceof AST.AST_Constant, tmpl("Unsupported expect_stdout format [{line},{col}]", {
                                line: label.start.line,
                                col: label.start.col
                            }));
                            return node.value;
                        }));
                    } else {
                        test[label.name] = read_string(stat) + "\n";
                    }
                } else if (label.name === "prepend_code") {
                    test[label.name] = read_string(stat);
                } else if (label.name === "no_mozilla_ast") {
                    test[label.name] = read_boolean(stat);
                } else {
                    test[label.name] = stat;
                }
                return true;
            }
        });
