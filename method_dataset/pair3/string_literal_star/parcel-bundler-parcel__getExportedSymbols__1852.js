function __method_wrapper__() {
  getExportedSymbols(
    asset: Asset,
    boundary: ?Bundle,
  ): Array<InternalExportSymbolResolution> {
    if (!asset.symbols) {
      return [];
    }

    let symbols = [];

    for (let symbol of asset.symbols.keys()) {
      symbols.push({
        ...this.getSymbolResolution(asset, symbol, boundary),
        exportAs: symbol,
      });
    }

    let deps = this.getDependencies(asset);
    for (let dep of deps) {
      let depSymbols = dep.symbols;
      if (!depSymbols) continue;

      if (depSymbols.get('*')?.local === '*') {
        let resolved = this.getResolvedAsset(dep, boundary);
        if (!resolved) continue;
        let exported = this.getExportedSymbols(resolved, boundary)
          .filter(s => s.exportSymbol !== 'default')
          .map(s =>
            s.exportSymbol !== '*' ? {...s, exportAs: s.exportSymbol} : s,
          );
        symbols.push(...exported);
      }
    }

    return symbols;
  }

}
