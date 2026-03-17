function __method_wrapper__() {
    it('supports import default CommonJS interop (individual exports)', async function () {
      let b = await bundle(
        path.join(
          __dirname,
          '/integration/scope-hoisting/es6/import-commonjs-export-individual-default/a.js',
        ),
      );

      assert.deepStrictEqual(
        new Set(nullthrows(findAsset(b, 'b1.js')).symbols.exportSymbols()),
        new Set(['*', 'default', 'foo']),
      );

      assert.deepStrictEqual(
        new Set(nullthrows(findAsset(b, 'b2.js')).symbols.exportSymbols()),
        new Set(['*', 'foo', 'default', '__esModule']),
      );

      assert.deepStrictEqual(
        new Set(nullthrows(findAsset(b, 'b3.js')).symbols.exportSymbols()),
        new Set(['*']),
      );

      let output = await run(b);
      assert.deepEqual(output, {
        x: {foo: 1, default: 2},
        y: 4,
        z: 6,
      });
    });

}
