function __method_wrapper__() {
    it('supports default importing CommonJS (export namespace)', async function () {
      let b = await bundle(
        path.join(
          __dirname,
          '/integration/scope-hoisting/es6/import-commonjs-export-object-default/a.js',
        ),
      );

      assert.deepStrictEqual(
        new Set(nullthrows(findAsset(b, 'b1.js')).symbols.exportSymbols()),
        new Set(['*']),
      );

      assert.deepStrictEqual(
        new Set(nullthrows(findAsset(b, 'b2.js')).symbols.exportSymbols()),
        new Set(['*']),
      );

      let output = await run(b);
      assert.deepEqual(output, {
        x: {foo: 1, default: 2},
        y: 4,
      });
    });

}
