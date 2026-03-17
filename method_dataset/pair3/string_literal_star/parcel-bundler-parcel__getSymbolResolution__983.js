function __method_wrapper__() {
  getSymbolResolution(
    parentAsset: Asset,
    resolved: Asset,
    imported: string,
    dep?: Dependency,
    replacements?: Map<string, string>,
  ): string {
    let {
      asset: resolvedAsset,
      exportSymbol,
      symbol,
    } = this.bundleGraph.getSymbolResolution(resolved, imported, this.bundle);

    if (
      resolvedAsset.type !== 'js' ||
      (dep && this.bundleGraph.isDependencySkipped(dep))
    ) {
      // Graceful fallback for non-js imports or when trying to resolve a symbol
      // that is actually unused but we still need a placeholder value.
      return '{}';
    }

    let isWrapped = this.isWrapped(resolvedAsset, parentAsset);
    let staticExports = resolvedAsset.meta.staticExports !== false;
    let publicId = this.bundleGraph.getAssetPublicId(resolvedAsset);

    // External CommonJS dependencies need to be accessed as an object property rather than imported
    // directly to maintain live binding.
    let isExternalCommonJS =
      !isWrapped &&
      this.bundle.env.isLibrary &&
      this.bundle.env.outputFormat === 'commonjs' &&
      !this.bundle.hasAsset(resolvedAsset);

    // If the resolved asset is wrapped, but imported at the top-level by this asset,
    // then we hoist parcelRequire calls to the top of this asset so side effects run immediately.
    if (
      isWrapped &&
      dep &&
      !dep?.meta.shouldWrap &&
      symbol !== false &&
      // Only do this if the asset is part of a different bundle (so it was definitely
      // parcelRequire.register'ed there), or if it is indeed registered in this bundle.
      (!this.bundle.hasAsset(resolvedAsset) ||
        !this.shouldSkipAsset(resolvedAsset))
    ) {
      let hoisted = this.hoistedRequires.get(dep.id);
      if (!hoisted) {
        hoisted = new Map();
        this.hoistedRequires.set(dep.id, hoisted);
      }

      hoisted.set(
        resolvedAsset.id,
        `var $${publicId} = parcelRequire(${JSON.stringify(publicId)});`,
      );
    }

    if (isWrapped) {
      this.needsPrelude = true;
    }

    // If this is an ESM default import of a CJS module with a `default` symbol,
    // and no __esModule flag, we need to resolve to the namespace instead.
    let isDefaultInterop =
      exportSymbol === 'default' &&
      staticExports &&
      !isWrapped &&
      (dep?.meta.kind === 'Import' || dep?.meta.kind === 'Export') &&
      resolvedAsset.symbols.hasExportSymbol('*') &&
      resolvedAsset.symbols.hasExportSymbol('default') &&
      !resolvedAsset.symbols.hasExportSymbol('__esModule');

    // Find the namespace object for the resolved module. If wrapped and this
    // is an inline require (not top-level), use a parcelRequire call, otherwise
    // the hoisted variable declared above. Otherwise, if not wrapped, use the
    // namespace export symbol.
    let assetId = resolvedAsset.meta.id;
    invariant(typeof assetId === 'string');
    let obj;
    if (isWrapped && (!dep || dep?.meta.shouldWrap)) {
      // Wrap in extra parenthesis to not change semantics, e.g.`new (parcelRequire("..."))()`.
      obj = `(parcelRequire(${JSON.stringify(publicId)}))`;
    } else if (isWrapped && dep) {
      obj = `$${publicId}`;
    } else {
      obj = resolvedAsset.symbols.get('*')?.local || `$${assetId}$exports`;
      obj = replacements?.get(obj) || obj;
    }

    if (imported === '*' || exportSymbol === '*' || isDefaultInterop) {
      // Resolve to the namespace object if requested or this is a CJS default interop reqiure.
      if (
        parentAsset === resolvedAsset &&
        this.wrappedAssets.has(resolvedAsset.id)
      ) {
        // Directly use module.exports for wrapped assets importing themselves.
        return 'module.exports';
      } else {
        return obj;
      }
    } else if (
      (!staticExports || isWrapped || !symbol || isExternalCommonJS) &&
      resolvedAsset !== parentAsset
    ) {
      // If the resolved asset is wrapped or has non-static exports,
      // we need to use a member access off the namespace object rather
      // than a direct reference. If importing default from a CJS module,
      // use a helper to check the __esModule flag at runtime.
      let kind = dep?.meta.kind;
      if (
        (!dep || kind === 'Import' || kind === 'Export') &&
        exportSymbol === 'default' &&
        resolvedAsset.symbols.hasExportSymbol('*') &&
        this.needsDefaultInterop(resolvedAsset)
      ) {
        this.usedHelpers.add('$parcel$interopDefault');
        return `(/*@__PURE__*/$parcel$interopDefault(${obj}))`;
      } else {
        return this.getPropertyAccess(obj, exportSymbol);
      }
    } else if (!symbol) {
      invariant(false, 'Asset was skipped or not found.');
    } else {
      return replacements?.get(symbol) || symbol;
    }
  }

}
