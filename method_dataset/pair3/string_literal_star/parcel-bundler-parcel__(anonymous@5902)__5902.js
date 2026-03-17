function __method_wrapper__() {
      it('supports excluding CommonJS (CommonJS used)', async function () {
        let b = await bundle(
          path.join(
            __dirname,
            '/integration/scope-hoisting/es6/side-effects-commonjs/b.js',
          ),
          options,
        );

        if (usesSymbolPropagation) {
          assert(!findAsset(b, 'esm.js'));
          assert(!findAsset(b, 'index.js'));
          assert.deepStrictEqual(
            new Set(b.getUsedSymbols(nullthrows(findAsset(b, 'commonjs.js')))),
            // the exports object is used freely
            new Set(shouldScopeHoist ? ['*', 'message2'] : ['message2']),
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
        assert.deepEqual(calls, ['commonjs']);
        assert.deepEqual(res.output, 'Message 2');
      });

}
