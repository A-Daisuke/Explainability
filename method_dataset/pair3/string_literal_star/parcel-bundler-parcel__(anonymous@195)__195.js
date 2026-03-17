function __method_wrapper__() {
    it.skip('updates config for custom namespace', async () => {
      await fsFixture(overlayFS, '/')`
        ${path.resolve(
          path.join(__dirname, '../../../configs/namespace/package.json'),
        )}: ${{
        name: '@parcel/config-namespace',
      }}
        app
          yarn.lock:
          .parcelrc: ${{
            extends: '@namespace/parcel-config-namespace',
            transformers: {
              '*': [
                '@namespace/parcel-transformer-js',
                '@namespace/parcel-transformer-local',
              ],
            },
          }}
          package.json: ${{
            ['@namespace/parcel-transformer-js']: {},
            ['@namespace/parcel-transformer-local']: {},
          }}`;

      overlayFS.chdir('/app');

      let cli = createProgram({fs: overlayFS});
      await cli('link --namespace @namespace');

      assert(overlayFS.existsSync('.parcel-link'));

      assert.equal(
        overlayFS.readFileSync('.parcelrc', 'utf8'),
        JSON.stringify({
          extends: '@parcel/config-namespace',
          transformers: {
            '*': [
              '@parcel/transformer-js',
              '@namespace/parcel-transformer-local',
            ],
          },
        }),
      );

      assert.equal(
        overlayFS.readFileSync('package.json', 'utf8'),
        JSON.stringify({
          ['@parcel/transformer-js']: {},
          ['@namespace/parcel-transformer-local']: {},
        }),
      );
    });

}
