function __method_wrapper__() {
  buildAssetPrelude(
    asset: Asset,
    deps: Array<Dependency>,
    replacements: Map<string, string>,
  ): [string, number, string] {
    let prepend = '';
    let prependLineCount = 0;
    let append = '';

    let shouldWrap = this.wrappedAssets.has(asset.id);
    let usedSymbols = nullthrows(this.bundleGraph.getUsedSymbols(asset));
    let assetId = asset.meta.id;
    invariant(typeof assetId === 'string');

    // If the asset has a namespace export symbol, it is CommonJS.
    // If there's no __esModule flag, and default is a used symbol, we need
    // to insert an interop helper.
    let defaultInterop =
      asset.symbols.hasExportSymbol('*') &&
      usedSymbols.has('default') &&
      !asset.symbols.hasExportSymbol('__esModule');

    let usedNamespace =
      // If the asset has * in its used symbols, we might need the exports namespace.
      // The one case where this isn't true is in ESM library entries, where the only
      // dependency on * is the entry dependency. In this case, we will use ESM exports
      // instead of the namespace object.
      (usedSymbols.has('*') &&
        (this.bundle.env.outputFormat !== 'esmodule' ||
          !this.bundle.env.isLibrary ||
          asset !== this.bundle.getMainEntry() ||
          this.bundleGraph
            .getIncomingDependencies(asset)
            .some(
              dep =>
                !dep.isEntry &&
                this.bundle.hasDependency(dep) &&
                nullthrows(this.bundleGraph.getUsedSymbols(dep)).has('*'),
            ))) ||
      // If a symbol is imported (used) from a CJS asset but isn't listed in the symbols,
      // we fallback on the namespace object.
      (asset.symbols.hasExportSymbol('*') &&
        [...usedSymbols].some(s => !asset.symbols.hasExportSymbol(s))) ||
      // If the exports has this asset's namespace (e.g. ESM output from CJS input),
      // include the namespace object for the default export.
      this.exportedSymbols.has(`$${assetId}$exports`) ||
      // CommonJS library bundle entries always need a namespace.
      (this.bundle.env.isLibrary &&
        this.bundle.env.outputFormat === 'commonjs' &&
        asset === this.bundle.getMainEntry());

    // If the asset doesn't have static exports, should wrap, the namespace is used,
    // or we need default interop, then we need to synthesize a namespace object for
    // this asset.
    if (
      asset.meta.staticExports === false ||
      shouldWrap ||
      usedNamespace ||
      defaultInterop
    ) {
      // Insert a declaration for the exports namespace object. If the asset is wrapped
      // we don't need to do this, because we'll use the `module.exports` object provided
      // by the wrapper instead. This is also true of CommonJS entry assets, which will use
      // the `module.exports` object provided by CJS.
      if (
        !shouldWrap &&
        (this.bundle.env.outputFormat !== 'commonjs' ||
          asset !== this.bundle.getMainEntry())
      ) {
        prepend += `var $${assetId}$exports = {};\n`;
        prependLineCount++;
      }

      // Insert the __esModule interop flag for this module if it has a `default` export
      // and the namespace symbol is used.
      // TODO: only if required by CJS?
      if (asset.symbols.hasExportSymbol('default') && usedSymbols.has('*')) {
        prepend += `\n$parcel$defineInteropFlag($${assetId}$exports);\n`;
        prependLineCount += 2;
        this.usedHelpers.add('$parcel$defineInteropFlag');
      }

      // Find wildcard re-export dependencies, and make sure their exports are also included in
      // ours. Importantly, add them before the asset's own exports so that wildcard exports get
      // correctly overwritten by own exports of the same name.
      for (let dep of deps) {
        let resolved = this.bundleGraph.getResolvedAsset(dep, this.bundle);
        if (dep.isOptional || this.bundleGraph.isDependencySkipped(dep)) {
          continue;
        }

        let isWrapped = resolved && resolved.meta.shouldWrap;

        for (let [imported, {local}] of dep.symbols) {
          if (imported === '*' && local === '*') {
            if (!resolved) {
              // Re-exporting an external module. This should have already been handled in buildReplacements.
              let external = nullthrows(
                nullthrows(this.externals.get(dep.specifier)).get('*'),
              );
              append += `$parcel$exportWildcard($${assetId}$exports, ${external});\n`;
              this.usedHelpers.add('$parcel$exportWildcard');
              continue;
            }

            // If the resolved asset has an exports object, use the $parcel$exportWildcard helper
            // to re-export all symbols. Otherwise, if there's no namespace object available, add
            // $parcel$export calls for each used symbol of the dependency.
            if (
              isWrapped ||
              resolved.meta.staticExports === false ||
              nullthrows(this.bundleGraph.getUsedSymbols(resolved)).has('*') ||
              // an empty asset
              (!resolved.meta.hasCJSExports &&
                resolved.symbols.hasExportSymbol('*'))
            ) {
              let obj = this.getSymbolResolution(
                asset,
                resolved,
                '*',
                dep,
                replacements,
              );
              append += `$parcel$exportWildcard($${assetId}$exports, ${obj});\n`;
              this.usedHelpers.add('$parcel$exportWildcard');
            } else {
              for (let symbol of nullthrows(
                this.bundleGraph.getUsedSymbols(dep),
              )) {
                if (
                  symbol === 'default' || // `export * as ...` does not include the default export
                  symbol === '__esModule'
                ) {
                  continue;
                }

                let resolvedSymbol = this.getSymbolResolution(
                  asset,
                  resolved,
                  symbol,
                  undefined,
                  replacements,
                );
                let get = this.buildFunctionExpression([], resolvedSymbol);
                let set = asset.meta.hasCJSExports
                  ? ', ' +
                    this.buildFunctionExpression(['v'], `${resolvedSymbol} = v`)
                  : '';
                prepend += `$parcel$export($${assetId}$exports, ${JSON.stringify(
                  symbol,
                )}, ${get}${set});\n`;
                this.usedHelpers.add('$parcel$export');
                prependLineCount++;
              }
            }
          }
        }
      }

      // Find the used exports of this module. This is based on the used symbols of
      // incoming dependencies rather than the asset's own used exports so that we include
      // re-exported symbols rather than only symbols declared in this asset.
      let incomingDeps = this.bundleGraph.getIncomingDependencies(asset);
      let usedExports = [...asset.symbols.exportSymbols()].filter(symbol => {
        if (symbol === '*') {
          return false;
        }

        // If we need default interop, then all symbols are needed because the `default`
        // symbol really maps to the whole namespace.
        if (defaultInterop) {
          return true;
        }

        let unused = incomingDeps.every(d => {
          let symbols = nullthrows(this.bundleGraph.getUsedSymbols(d));
          return !symbols.has(symbol) && !symbols.has('*');
        });
        return !unused;
      });

      if (usedExports.length > 0) {
        // Insert $parcel$export calls for each of the used exports. This creates a getter/setter
        // for the symbol so that when the value changes the object property also changes. This is
        // required to simulate ESM live bindings. It's easier to do it this way rather than inserting
        // additional assignments after each mutation of the original binding.
        prepend += `\n${usedExports
          .map(exp => {
            let resolved = this.getSymbolResolution(
              asset,
              asset,
              exp,
              undefined,
              replacements,
            );
            let get = this.buildFunctionExpression([], resolved);
            let isEsmExport = !!asset.symbols.get(exp)?.meta?.isEsm;
            let set =
              !isEsmExport && asset.meta.hasCJSExports
                ? ', ' + this.buildFunctionExpression(['v'], `${resolved} = v`)
                : '';
            return `$parcel$export($${assetId}$exports, ${JSON.stringify(
              exp,
            )}, ${get}${set});`;
          })
          .join('\n')}\n`;
        this.usedHelpers.add('$parcel$export');
        prependLineCount += 1 + usedExports.length;
      }
    }

    return [prepend, prependLineCount, append];
  }

}
