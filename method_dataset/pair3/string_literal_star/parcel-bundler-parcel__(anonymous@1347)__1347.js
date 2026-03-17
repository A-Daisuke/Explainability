class __C__ {
    it('should bailout with a non-static member access on a namespace', async function () {
      let b = await bundle(
        path.join(
          __dirname,
          '/integration/scope-hoisting/es6/import-namespace-static-member/b.js',
        ),
      );

      assert.deepStrictEqual(
        new Set(
          b.getUsedSymbols(findDependency(b, 'b.js', './library/index.js')),
        ),
        new Set(['*']),
      );

      let calls = [];
      let output = await run(b, {
        sideEffect: v => {
          calls.push(v);
        },
      });
      assert.deepEqual(output, 'foo');
      assert.deepEqual(calls, ['c1', 'c2', 'c3']);
    });

}
