function __method_wrapper__() {
    it("Should parse export directives", async function() {
        var inputs = [
            ['export * from "a.js"', ['*'], "a.js"],
            ['export {A} from "a.js"', ['A'], "a.js"],
            ['export {A as X} from "a.js"', ['X'], "a.js"],
            ['export {A as Foo, B} from "a.js"', ['Foo', 'B'], "a.js"],
            ['export {A, B} from "a.js"', ['A', 'B'], "a.js"],
        ];

        function test(code) {
            return parse(code);
        }

        function extractNames(symbols) {
            var ret = [];
            for (var i = 0; i < symbols.length; i++) {
                ret.push(symbols[i].foreign_name.name);
            }
            return ret;
        }

        for (var i = 0; i < inputs.length; i++) {
            var ast = test(inputs[i][0]);
            var names = inputs[i][1];
            var filename = inputs[i][2];
            assert(ast instanceof AST.AST_Toplevel);
            assert.equal(ast.body.length, 1);
            var st = ast.body[0];
            assert(st instanceof AST.AST_Export);
            var actualNames = extractNames(st.exported_names);
            assert.deepEqual(actualNames, names);
            assert.equal(st.module_name.value, filename);
        }
    });

}
