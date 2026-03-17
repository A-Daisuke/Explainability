    function sequencesize_2(statements, compressor) {
        function cons_seq(right) {
            n--;
            CHANGED = true;
            var left = prev.body;
            return make_sequence(left, [left, right]).transform(compressor);
        }
        var n = 0, prev;
        for (var i = 0; i < statements.length; i++) {
            var stat = statements[i];
            if (prev) {
                if (stat instanceof AST_Exit) {
                    stat.value = cons_seq(stat.value || make_node(AST_Undefined, stat).transform(compressor));
                } else if (stat instanceof AST_For) {
                    if (!(stat.init instanceof AST_DefinitionsLike)) {
                        const abort = walk(prev.body, node => {
                            if (node instanceof AST_Scope)
                                return true;
                            if (node instanceof AST_Binary
                                && node.operator === "in") {
                                return walk_abort;
                            }
                        });
                        if (!abort) {
                            if (stat.init)
                                stat.init = cons_seq(stat.init);
                            else {
                                stat.init = prev.body;
                                n--;
                                CHANGED = true;
                            }
                        }
                    }
                } else if (stat instanceof AST_ForIn) {
                    if (!(stat.init instanceof AST_DefinitionsLike) || stat.init instanceof AST_Var) {
                        stat.object = cons_seq(stat.object);
                    }
                } else if (stat instanceof AST_If) {
                    stat.condition = cons_seq(stat.condition);
                } else if (stat instanceof AST_Switch) {
                    stat.expression = cons_seq(stat.expression);
                } else if (stat instanceof AST_With) {
                    stat.expression = cons_seq(stat.expression);
                }
            }
            if (compressor.option("conditionals") && stat instanceof AST_If) {
                var decls = [];
                var body = to_simple_statement(stat.body, decls);
                var alt = to_simple_statement(stat.alternative, decls);
                if (body !== false && alt !== false && decls.length > 0) {
                    var len = decls.length;
                    decls.push(make_node(AST_If, stat, {
                        condition: stat.condition,
                        body: body || make_node(AST_EmptyStatement, stat.body),
                        alternative: alt
                    }));
                    decls.unshift(n, 1);
                    [].splice.apply(statements, decls);
                    i += len;
                    n += len + 1;
                    prev = null;
                    CHANGED = true;
                    continue;
                }
            }
            statements[n++] = stat;
            prev = stat instanceof AST_SimpleStatement ? stat : null;
        }
        statements.length = n;
    }
