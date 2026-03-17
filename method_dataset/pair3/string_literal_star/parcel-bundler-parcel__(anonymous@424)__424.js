function __method_wrapper__() {
    return deps.every(d => {
      // If this dependency has already been through this process, and we
      // know it's not deferrable, then there's no need to re-check
      if (this.undeferredDependencies.has(d)) {
        return false;
      }

      let depIsDeferrable =
        d.symbols &&
        !(d.env.isLibrary && d.isEntry) &&
        !d.symbols.has('*') &&
        ![...d.symbols.keys()].some(symbol => {
          let assetSymbol = resolvedAsset.symbols?.get(symbol)?.local;
          return assetSymbol != null && symbols.has(assetSymbol);
        });

      if (!depIsDeferrable) {
        // Mark this dep as not deferrable so it doesn't have to be re-checked
        this.undeferredDependencies.add(d);
        return false;
      }
    });

}
