function __method_wrapper__() {
      it('add and remove dependency (keep asset)', async function () {
        let testDir = path.join(
          __dirname,
          '/integration/scope-hoisting/es6/update-used-symbols-dependency-add',
        );

        let b = bundler(path.join(testDir, 'index.js'), {
          inputFS: overlayFS,
          outputFS: overlayFS,
        });

        await overlayFS.mkdirp(testDir);
        await overlayFS.copyFile(
          path.join(testDir, 'index.1.js'),
          path.join(testDir, 'index.js'),
        );

        let subscription = await b.watch();

        try {
          let bundleEvent = await getNextBuild(b);
          assert(bundleEvent.type === 'buildSuccess');
          let output = await run(bundleEvent.bundleGraph);
          assert.deepEqual(output, [123]);

          let assetC = nullthrows(findAsset(bundleEvent.bundleGraph, 'd1.js'));
          assert.deepStrictEqual(
            new Set(bundleEvent.bundleGraph.getUsedSymbols(assetC)),
            new Set(['a']),
          );
          assert(!findAsset(bundleEvent.bundleGraph, 'd2.js'));

          await overlayFS.copyFile(
            path.join(testDir, 'index.2.js'),
            path.join(testDir, 'index.js'),
          );

          bundleEvent = await getNextBuild(b);
          assert.strictEqual(bundleEvent.type, 'buildSuccess');
          output = await run(bundleEvent.bundleGraph);
          assert.deepEqual(output, [
            123,
            789,
            {
              d1: 1,
              d2: 2,
            },
          ]);

          assetC = nullthrows(findAsset(bundleEvent.bundleGraph, 'd1.js'));
          assert.deepStrictEqual(
            new Set(bundleEvent.bundleGraph.getUsedSymbols(assetC)),
            new Set(['a', 'b']),
          );
          let assetD = nullthrows(findAsset(bundleEvent.bundleGraph, 'd2.js'));
          assert.deepStrictEqual(
            new Set(bundleEvent.bundleGraph.getUsedSymbols(assetD)),
            new Set(['*']),
          );

          await overlayFS.copyFile(
            path.join(testDir, 'index.1.js'),
            path.join(testDir, 'index.js'),
          );

          bundleEvent = await getNextBuild(b);
          assert.strictEqual(bundleEvent.type, 'buildSuccess');
          output = await run(bundleEvent.bundleGraph);
          assert.deepEqual(output, [123]);

          assetC = nullthrows(findAsset(bundleEvent.bundleGraph, 'd1.js'));
          assert.deepStrictEqual(
            new Set(bundleEvent.bundleGraph.getUsedSymbols(assetC)),
            new Set(['a']),
          );
          assert(!findAsset(bundleEvent.bundleGraph, 'd2.js'));
        } finally {
          await subscription.unsubscribe();
        }
      });

}
