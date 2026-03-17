class __C__ {
    it("Should return the correct token for class methods", async function() {
        var tests = [
            {
                code: "class foo{static test(){}}",
                token_value_start: "static",
                token_value_end: "}"
            },
            {
                code: "class bar{*procedural(){}}",
                token_value_start: "*",
                token_value_end: "}"
            },
            {
                code: "class foobar{aMethod(){}}",
                token_value_start: "aMethod",
                token_value_end: "}"
            },
            {
                code: "class foobaz{get something(){}}",
                token_value_start: "get",
                token_value_end: "}"
            }
        ];

        for (var i = 0; i < tests.length; i++) {
            var ast = parse(tests[i].code);
            assert.strictEqual(ast.body[0].properties[0].start.value, tests[i].token_value_start);
            assert.strictEqual(ast.body[0].properties[0].end.value, tests[i].token_value_end);
        }
    });

}
