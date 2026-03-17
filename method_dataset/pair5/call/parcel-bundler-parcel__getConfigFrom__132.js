function __method_wrapper__() {
  async getConfigFrom<T>(
    searchPath: FilePath,
    fileNames: Array<string>,
    options: ?{|
      packageKey?: string,
      parse?: boolean,
      exclude?: boolean,
    |},
  ): Promise<?ConfigResultWithFilePath<T>> {
    let packageKey = options?.packageKey;
    if (packageKey != null) {
      let pkg = await this.getConfigFrom(searchPath, ['package.json'], {
        exclude: true,
      });

      if (pkg && pkg.contents[packageKey]) {
        // Invalidate only when the package key changes
        this.invalidateOnConfigKeyChange(pkg.filePath, packageKey);

        return {
          contents: pkg.contents[packageKey],
          filePath: pkg.filePath,
        };
      }
    }

    if (fileNames.length === 0) {
      return null;
    }

    // Invalidate when any of the file names are created above the search path.
    for (let fileName of fileNames) {
      this.invalidateOnFileCreate({
        fileName,
        aboveFilePath: searchPath,
      });
    }

    let parse = options && options.parse;
    let configFilePath = await resolveConfig(
      this.#options.inputFS,
      searchPath,
      fileNames,
      this.#options.projectRoot,
    );
    if (configFilePath == null) {
      return null;
    }

    if (!options || !options.exclude) {
      this.invalidateOnFileChange(configFilePath);
    }

    // If this is a JavaScript file, load it with the package manager.
    let extname = path.extname(configFilePath);
    if (extname === '.js' || extname === '.cjs' || extname === '.mjs') {
      let specifier = relativePath(path.dirname(searchPath), configFilePath);

      // Add dev dependency so we reload the config and any dependencies in watch mode.
      this.addDevDependency({
        specifier,
        resolveFrom: searchPath,
      });

      // Invalidate on startup in case the config is non-deterministic,
      // e.g. uses unknown environment variables, reads from the filesystem, etc.
      this.invalidateOnStartup();

      let config = await this.#options.packageManager.require(
        specifier,
        searchPath,
      );

      if (
        // $FlowFixMe
        Object.prototype.toString.call(config) === '[object Module]' &&
        config.default != null
      ) {
        // Native ESM config. Try to use a default export, otherwise fall back to the whole namespace.
        config = config.default;
      }

      return {
        contents: config,
        filePath: configFilePath,
      };
    }

    let conf = await readConfig(
      this.#options.inputFS,
      configFilePath,
      parse == null ? null : {parse},
    );
    if (conf == null) {
      return null;
    }

    return {
      contents: conf.config,
      filePath: configFilePath,
    };
  }

}
