function __method_wrapper__() {
  needsDefaultInterop(asset: Asset): boolean {
    if (
      asset.symbols.hasExportSymbol('*') &&
      !asset.symbols.hasExportSymbol('default')
    ) {
      let deps = this.bundleGraph.getIncomingDependencies(asset);
      return deps.some(
        dep =>
          this.bundle.hasDependency(dep) &&
          // dep.meta.isES6Module &&
          dep.symbols.hasExportSymbol('default'),
      );
    }

    return false;
  }

}
