function __method_wrapper__() {
      pipeline.postProcess = async (
        assets: Array<UncommittedAsset>,
      ): Promise<Array<UncommittedAsset> | null> => {
        let results = await postProcess.call(transformer, {
          assets: assets.map(asset => new MutableAsset(asset)),
          config,
          options: pipeline.pluginOptions,
          resolve,
          logger,
          tracer,
        });

        return Promise.all(
          results.map(result =>
            asset.createChildAsset(
              result,
              transformerName,
              parcelConfig.filePath,
              // configKeyPath,
            ),
          ),
        );
      };

}
