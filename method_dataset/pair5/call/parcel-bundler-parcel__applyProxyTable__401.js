function __method_wrapper__() {
  async applyProxyTable(app: any): Promise<Server> {
    // avoid skipping project root
    const fileInRoot: string = path.join(this.options.projectRoot, 'index');

    const configFilePath = await resolveConfig(
      this.options.inputFS,
      fileInRoot,
      [
        '.proxyrc.cts',
        '.proxyrc.mts',
        '.proxyrc.ts',
        '.proxyrc.cjs',
        '.proxyrc.mjs',
        '.proxyrc.js',
        '.proxyrc',
        '.proxyrc.json',
      ],
      this.options.projectRoot,
    );

    if (!configFilePath) {
      return this;
    }

    const filename = path.basename(configFilePath);

    if (filename === '.proxyrc' || filename === '.proxyrc.json') {
      let conf = await readConfig(this.options.inputFS, configFilePath);
      if (!conf) {
        return this;
      }
      let cfg = conf.config;
      if (typeof cfg !== 'object') {
        this.options.logger.warn({
          message:
            "Proxy table in '.proxyrc' should be of object type. Skipping...",
        });
        return this;
      }
      for (const [context, options] of Object.entries(cfg)) {
        // each key is interpreted as context, and value as middleware options
        app.use(createProxyMiddleware(context, options));
      }
    } else {
      let cfg = await this.options.packageManager.require(
        configFilePath,
        fileInRoot,
      );
      if (
        // $FlowFixMe
        Object.prototype.toString.call(cfg) === '[object Module]'
      ) {
        cfg = cfg.default;
      }

      if (typeof cfg !== 'function') {
        this.options.logger.warn({
          message: `Proxy configuration file '${filename}' should export a function. Skipping...`,
        });
        return this;
      }
      cfg(app);
    }

    return this;
  }

}
