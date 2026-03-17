function __method_wrapper__() {
  shouldDeferDependency(
    dependency: Dependency,
    sideEffects: ?boolean,
    canDefer: boolean,
  ): boolean {
    let dependencySymbols = dependency.symbols;

    // Doing this separately keeps Flow happy further down
    if (!dependencySymbols) {
      return false;
    }

    let isDeferrable =
      [...dependencySymbols].every(([, {isWeak}]) => isWeak) &&
      sideEffects === false &&
      canDefer &&
      !dependencySymbols.has('*');

    if (!isDeferrable) {
      return false;
    }

    let depNodeId = this.getNodeIdByContentKey(dependency.id);
    let depNode = this.getNode(depNodeId);
    invariant(depNode);

    let assets = this.getNodeIdsConnectedTo(depNodeId);
    let symbols = new Map(
      [...dependencySymbols].map(([key, val]) => [val.local, key]),
    );
    invariant(assets.length === 1);
    let firstAsset = nullthrows(this.getNode(assets[0]));
    invariant(firstAsset.type === 'asset');
    let resolvedAsset = firstAsset.value;

    // This doesn't change from here, so checking it now saves
    // us some calls to `getIncomingDependency`
    if (!resolvedAsset.symbols) {
      return true;
    }

    let deps = this.getIncomingDependencies(resolvedAsset);

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

}
