function __method_wrapper__() {
    it.skip('updates config for custom namespace', async () => {
      await fsFixture(overlayFS)`
        yarn.lock:
        .parcelrc: ${{
          extends: '@parcel/config-namespace',
          transformers: {
            '*': [
              '@parcel/transformer-js',
              '@namespace/parcel-transformer-local',
            ],
          },
        }}
        package.json: ${{
          ['@parcel/transformer-js']: {},
          ['@namespace/parcel-transformer-local']: {},
        }}
        .parcel-link: ${{
          appRoot: '/app',
          packageRoot: path.resolve(__dirname, '../../..'),
          nodeModulesGlobs: ['node_modules'],
          namespace: '@namespace',
        }}`;

      await fsFixture(overlayFS, '/')`
        ${path.resolve(
          path.join(__dirname, '../../../configs/namespace/package.json'),
        )}: ${{
        name: '@parcel/config-namespace',
      }}`;

      let cli = createProgram({fs: overlayFS});
      await cli('unlink');

      assert(!overlayFS.existsSync('.parcel-link'));

      assert.equal(
        overlayFS.readFileSync('.parcelrc', 'utf8'),
        JSON.stringify({
          extends: '@namespace/parcel-config-namespace',
          transformers: {
            '*': [
              '@namespace/parcel-transformer-js',
              '@namespace/parcel-transformer-local',
            ],
          },
        }),
      );

      assert.equal(
        overlayFS.readFileSync('package.json', 'utf8'),
        JSON.stringify({
          ['@namespace/parcel-transformer-js']: {},
          ['@namespace/parcel-transformer-local']: {},
        }),
      );
    });

}
