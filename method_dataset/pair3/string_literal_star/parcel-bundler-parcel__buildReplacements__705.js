function __method_wrapper__() {
  buildReplacements(
    asset: Asset,
    deps: Array<Dependency>,
  ): [Map<string, Array<Dependency>>, Map<string, string>] {
    let assetId = asset.meta.id;
    invariant(typeof assetId === 'string');

    // Build two maps: one of import specifiers, and one of imported symbols to replace.
    // These will be used to build a regex below.
    let depMap = new DefaultMap<string, Array<Dependency>>(() => []);
    let replacements = new Map();
    for (let dep of deps) {
      let specifierType =
        dep.specifierType === 'esm' ? `:${dep.specifierType}` : '';
      depMap
        .get(
          `${assetId}:${getSpecifier(dep)}${
            !dep.meta.placeholder ? specifierType : ''
          }`,
        )
        .push(dep);

      let asyncResolution = this.bundleGraph.resolveAsyncDependency(
        dep,
        this.bundle,
      );
      let resolved =
        asyncResolution?.type === 'asset'
          ? // Prefer the underlying asset over a runtime to load it. It will
            // be wrapped in Promise.resolve() later.
            asyncResolution.value
          : this.bundleGraph.getResolvedAsset(dep, this.bundle);
      if (
        !resolved &&
        !dep.isOptional &&
        !this.bundleGraph.isDependencySkipped(dep)
      ) {
        this.addExternal(dep, replacements);
      }

      if (!resolved) {
        continue;
      }

      // Handle imports from other bundles in libraries.
      if (this.bundle.env.isLibrary && !this.bundle.hasAsset(resolved)) {
        let referencedBundle = this.bundleGraph.getReferencedBundle(
          dep,
          this.bundle,
        );
        if (
          referencedBundle &&
          referencedBundle.getMainEntry() === resolved &&
          referencedBundle.type === 'js' &&
          !this.bundleGraph.isAssetReferenced(referencedBundle, resolved)
        ) {
          this.addExternal(dep, replacements, referencedBundle);
          this.externalAssets.add(resolved);
          continue;
        }
      }

      for (let [imported, {local}] of dep.symbols) {
        if (local === '*') {
          continue;
        }

        let symbol = this.getSymbolResolution(asset, resolved, imported, dep);
        replacements.set(
          local,
          // If this was an internalized async asset, wrap in a Promise.resolve.
          asyncResolution?.type === 'asset'
            ? `Promise.resolve(${symbol})`
            : symbol,
        );
      }

      // Async dependencies need a namespace object even if all used symbols were statically analyzed.
      // This is recorded in the promiseSymbol meta property set by the transformer rather than in
      // symbols so that we don't mark all symbols as used.
      if (dep.priority === 'lazy' && dep.meta.promiseSymbol) {
        let promiseSymbol = dep.meta.promiseSymbol;
        invariant(typeof promiseSymbol === 'string');
        let symbol = this.getSymbolResolution(asset, resolved, '*', dep);
        replacements.set(
          promiseSymbol,
          asyncResolution?.type === 'asset'
            ? `Promise.resolve(${symbol})`
            : symbol,
        );
      }
    }

    // If this asset is wrapped, we need to replace the exports namespace with `module.exports`,
    // which will be provided to us by the wrapper.
    if (
      this.wrappedAssets.has(asset.id) ||
      (this.bundle.env.outputFormat === 'commonjs' &&
        asset === this.bundle.getMainEntry())
    ) {
      let exportsName = asset.symbols.get('*')?.local || `$${assetId}$exports`;
      replacements.set(exportsName, 'module.exports');
    }

    return [depMap, replacements];
  }

}
