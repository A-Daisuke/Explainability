function __method_wrapper__() {
      it('supports excluding CommonJS (CommonJS unused)', async function () {
        let b = await bundle(
          path.join(
            __dirname,
            '/integration/scope-hoisting/es6/side-effects-commonjs/a.js',
          ),
          options,
        );

        if (usesSymbolPropagation) {
          assert.deepStrictEqual(
            new Set(b.getUsedSymbols(nullthrows(findAsset(b, 'esm.js')))),
            new Set(['message1']),
          );
          // We can't statically analyze commonjs.js, so message1 appears to be used
          assert.deepStrictEqual(
            new Set(b.getUsedSymbols(nullthrows(findAsset(b, 'commonjs.js')))),
            // the exports object is used freely
            new Set(shouldScopeHoist ? ['*', 'message1'] : ['message1']),
          );
          assert.deepStrictEqual(
            new Set(
              b.getUsedSymbols(findDependency(b, 'index.js', './commonjs.js')),
            ),
            new Set(['message1']),
          );
        }

        let calls = [];
        let res = await run(
          b,
          {
            sideEffect: caller => {
              calls.push(caller);
            },
          },
          {require: false},
        );

        assert.deepEqual(calls, ['esm', 'commonjs', 'index']);
        assert.deepEqual(res.output, 'Message 1');
      });

}
