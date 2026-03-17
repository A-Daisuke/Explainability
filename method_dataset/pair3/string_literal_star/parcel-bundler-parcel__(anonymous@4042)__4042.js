function __method_wrapper__() {
    it('define exports in the outermost scope', async function () {
      let b = await bundle(
        path.join(
          __dirname,
          '/integration/scope-hoisting/commonjs/define-exports/a.js',
        ),
      );

      assert.deepStrictEqual(
        new Set(b.getUsedSymbols(nullthrows(findAsset(b, 'a.js')))),
        new Set(['*']),
      );

      let output = await run(b);
      assert.equal(output, 'bar');
    });

}
