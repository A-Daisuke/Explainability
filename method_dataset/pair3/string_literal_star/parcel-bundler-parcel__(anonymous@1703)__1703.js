class __C__ {
      it('supports tree shaking statically analyzable dynamic import: namespace await declaration eval bailout', async function () {
        let b = await bundle(
          path.join(
            __dirname,
            '/integration/scope-hoisting/es6/tree-shaking-dynamic-import/await-declaration-namespace-bailout-eval.js',
          ),
        );

        let output = await run(b);
        assert.deepEqual(output, 'thing');

        assert.deepStrictEqual(
          new Set(
            b.getUsedSymbols(
              findDependency(
                b,
                'await-declaration-namespace-bailout-eval.js',
                './async.js',
              ),
            ),
          ),
          new Set(['*']),
        );
      });

}
