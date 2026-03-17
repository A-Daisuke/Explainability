function __method_wrapper__() {
  buildExportedSymbols() {
    if (
      (!this.bundle.env.isLibrary && this.bundle.env.isBrowser()) ||
      this.bundle.env.outputFormat !== 'esmodule'
    ) {
      return;
    }

    // TODO: handle ESM exports of wrapped entry assets...
    let entry = this.bundle.getMainEntry();
    if (entry && !this.wrappedAssets.has(entry.id)) {
      let hasNamespace = entry.symbols.hasExportSymbol('*');

      for (let {
        asset,
        exportAs,
        symbol,
        exportSymbol,
      } of this.bundleGraph.getExportedSymbols(entry)) {
        if (typeof symbol === 'string') {
          // If the module has a namespace (e.g. commonjs), and this is not an entry, only export the namespace
          // as default, without individual exports. This mirrors the importing logic in addExternal, avoiding
          // extra unused exports and potential for non-identifier export names.
          if (
            hasNamespace &&
            !this.bundle.needsStableName &&
            exportAs !== '*'
          ) {
            continue;
          }

          let symbols = this.exportedSymbols.get(
            symbol === '*' ? nullthrows(entry.symbols.get('*')?.local) : symbol,
          )?.exportAs;

          if (!symbols) {
            symbols = [];
            this.exportedSymbols.set(symbol, {
              asset,
              exportSymbol,
              local: symbol,
              exportAs: symbols,
            });
          }

          if (exportAs === '*') {
            exportAs = 'default';
          }

          symbols.push(exportAs);
        } else if (symbol === null) {
          // TODO `meta.exportsIdentifier[exportSymbol]` should be exported
          // let relativePath = relative(options.projectRoot, asset.filePath);
          // throw getThrowableDiagnosticForNode(
          //   md`${relativePath} couldn't be statically analyzed when importing '${exportSymbol}'`,
          //   entry.filePath,
          //   loc,
          // );
        } else if (symbol !== false) {
          // let relativePath = relative(options.projectRoot, asset.filePath);
          // throw getThrowableDiagnosticForNode(
          //   md`${relativePath} does not export '${exportSymbol}'`,
          //   entry.filePath,
          //   loc,
          // );
        }
      }
    }
  }

}
