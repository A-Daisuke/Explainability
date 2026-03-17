function __method_wrapper__() {
  async package(): Promise<{|contents: string, map: ?SourceMap|}> {
    let wrappedAssets = await this.loadAssets();
    this.buildExportedSymbols();

    // If building a library, the target is actually another bundler rather
    // than the final output that could be loaded in a browser. So, loader
    // runtimes are excluded, and instead we add imports into the entry bundle
    // of each bundle group pointing at the sibling bundles. These can be
    // picked up by another bundler later at which point runtimes will be added.
    if (
      this.bundle.env.isLibrary ||
      this.bundle.env.outputFormat === 'commonjs' ||
      (this.bundle.env.outputFormat === 'esmodule' && !this.isAsyncBundle)
    ) {
      for (let b of this.bundleGraph.getReferencedBundles(this.bundle, {
        recursive: false,
      })) {
        if (this.bundle.env.isLibrary || b.type === 'js') {
          this.externals.set(relativeBundlePath(this.bundle, b), new Map());
        }
      }
    }

    let res = '';
    let lineCount = 0;
    let sourceMap = null;
    let processAsset = asset => {
      let [content, map, lines] = this.visitAsset(asset);
      if (sourceMap && map) {
        sourceMap.addSourceMap(map, lineCount);
      } else if (this.bundle.env.sourceMap) {
        sourceMap = map;
      }

      res += content + '\n';
      lineCount += lines + 1;
    };

    // Hoist wrapped asset to the top of the bundle to ensure that they are registered
    // before they are used.
    for (let asset of wrappedAssets) {
      if (!this.seenAssets.has(asset.id)) {
        processAsset(asset);
      }
    }

    // Add each asset that is directly connected to the bundle. Dependencies will be handled
    // by replacing `import` statements in the code.
    this.bundle.traverseAssets((asset, _, actions) => {
      if (this.seenAssets.has(asset.id)) {
        actions.skipChildren();
        return;
      }

      processAsset(asset);
      actions.skipChildren();
    });

    let [prelude, preludeLines] = this.buildBundlePrelude();
    res = prelude + res;
    lineCount += preludeLines;
    sourceMap?.offsetLines(1, preludeLines);

    let entries = this.bundle.getEntryAssets();
    let mainEntry = this.bundle.getMainEntry();
    if (this.isAsyncBundle) {
      // In async bundles we don't want the main entry to execute until we require it
      // as there might be dependencies in a sibling bundle that hasn't loaded yet.
      entries = entries.filter(a => a.id !== mainEntry?.id);
      mainEntry = null;
    }

    let needsBundleQueue = this.shouldBundleQueue(this.bundle);

    // If any of the entry assets are wrapped, call parcelRequire so they are executed.
    for (let entry of entries) {
      if (this.wrappedAssets.has(entry.id) && !this.isScriptEntry(entry)) {
        let parcelRequire = `parcelRequire(${JSON.stringify(
          this.bundleGraph.getAssetPublicId(entry),
        )});\n`;

        let entryExports = entry.symbols.get('*')?.local;

        if (
          entryExports &&
          entry === mainEntry &&
          this.exportedSymbols.has(entryExports)
        ) {
          invariant(
            !needsBundleQueue,
            'Entry exports are not yet compaitble with async bundles',
          );
          res += `\nvar ${entryExports} = ${parcelRequire}`;
        } else {
          if (needsBundleQueue) {
            parcelRequire = this.runWhenReady(this.bundle, parcelRequire);
          }

          res += `\n${parcelRequire}`;
        }

        lineCount += 2;
      }
    }

    let [postlude, postludeLines] = this.outputFormat.buildBundlePostlude();
    res += postlude;
    lineCount += postludeLines;

    // The entry asset of a script bundle gets hoisted outside the bundle wrapper so that
    // its top-level variables become globals like a real browser script. We need to replace
    // all dependency references for runtimes with a parcelRequire call.
    if (
      this.bundle.env.outputFormat === 'global' &&
      this.bundle.env.sourceType === 'script'
    ) {
      res += '\n';
      lineCount++;

      let mainEntry = nullthrows(this.bundle.getMainEntry());
      let {code, map: mapBuffer} = nullthrows(
        this.assetOutputs.get(mainEntry.id),
      );
      let map;
      if (mapBuffer) {
        map = new SourceMap(this.options.projectRoot, mapBuffer);
      }
      res += replaceScriptDependencies(
        this.bundleGraph,
        this.bundle,
        code,
        map,
        this.parcelRequireName,
      );
      if (sourceMap && map) {
        sourceMap.addSourceMap(map, lineCount);
      }
    }

    return {
      contents: res,
      map: sourceMap,
    };
  }

}
