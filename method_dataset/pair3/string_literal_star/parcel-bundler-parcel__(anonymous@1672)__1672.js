function __method_wrapper__() {
      it('supports tree shaking statically analyzable dynamic import: namespace await declaration bailout', async function () {
        let b = await bundle(
          path.join(
            __dirname,
            '/integration/scope-hoisting/es6/tree-shaking-dynamic-import/await-declaration-namespace-bailout.js',
          ),
        );

        let output = await run(b);
        assert.deepEqual(output, {
          bar: 'bar',
          foo: 'foo',
          other: 'other',
          stuff: 'stuff',
          thing: 'thing',
        });

        assert.deepStrictEqual(
          new Set(
            b.getUsedSymbols(
              findDependency(
                b,
                'await-declaration-namespace-bailout.js',
                './async.js',
              ),
            ),
          ),
          new Set(['*']),
        );
      });

}
