function __method_wrapper__() {
  getSymbolResolution(
    asset: Asset,
    symbol: Symbol,
    boundary: ?Bundle,
  ): InternalSymbolResolution {
    let assetOutside = boundary && !this.bundleHasAsset(boundary, asset);

    let identifier = asset.symbols?.get(symbol)?.local;
    if (symbol === '*') {
      return {
        asset,
        exportSymbol: '*',
        symbol: identifier ?? null,
        loc: asset.symbols?.get(symbol)?.loc,
      };
    }

    let found = false;
    let nonStaticDependency = false;
    let skipped = false;
    let deps = this.getDependencies(asset).reverse();
    let potentialResults = [];
    for (let dep of deps) {
      let depSymbols = dep.symbols;
      if (!depSymbols) {
        nonStaticDependency = true;
        continue;
      }
      // If this is a re-export, find the original module.
      let symbolLookup = new Map(
        [...depSymbols].map(([key, val]) => [val.local, key]),
      );
      let depSymbol = symbolLookup.get(identifier);
      if (depSymbol != null) {
        let resolved = this.getResolvedAsset(dep, boundary);
        if (!resolved || resolved.id === asset.id) {
          // External module or self-reference
          return {
            asset,
            exportSymbol: symbol,
            symbol: identifier,
            loc: asset.symbols?.get(symbol)?.loc,
          };
        }

        if (assetOutside) {
          // We found the symbol, but `asset` is outside, return `asset` and the original symbol
          found = true;
          break;
        }

        if (this.isDependencySkipped(dep)) {
          // We found the symbol and `dep` was skipped
          skipped = true;
          break;
        }

        let {
          asset: resolvedAsset,
          symbol: resolvedSymbol,
          exportSymbol,
          loc,
        } = this.getSymbolResolution(resolved, depSymbol, boundary);

        if (!loc) {
          // Remember how we got there
          loc = asset.symbols?.get(symbol)?.loc;
        }

        return {
          asset: resolvedAsset,
          symbol: resolvedSymbol,
          exportSymbol,
          loc,
        };
      }
      // If this module exports wildcards, resolve the original module.
      // Default exports are excluded from wildcard exports.
      // Wildcard reexports are never listed in the reexporting asset's symbols.
      if (
        identifier == null &&
        depSymbols.get('*')?.local === '*' &&
        symbol !== 'default'
      ) {
        let resolved = this.getResolvedAsset(dep, boundary);
        if (!resolved) {
          continue;
        }
        let result = this.getSymbolResolution(resolved, symbol, boundary);

        // We found the symbol
        if (result.symbol != undefined) {
          if (assetOutside) {
            // ..., but `asset` is outside, return `asset` and the original symbol
            found = true;
            break;
          }
          if (this.isDependencySkipped(dep)) {
            // We found the symbol and `dep` was skipped
            skipped = true;
            break;
          }

          return {
            asset: result.asset,
            symbol: result.symbol,
            exportSymbol: result.exportSymbol,
            loc: resolved.symbols?.get(symbol)?.loc,
          };
        }
        if (result.symbol === null) {
          found = true;
          if (boundary && !this.bundleHasAsset(boundary, result.asset)) {
            // If the returned asset is outside (and it's the first asset that is outside), return it.
            if (!assetOutside) {
              return {
                asset: result.asset,
                symbol: result.symbol,
                exportSymbol: result.exportSymbol,
                loc: resolved.symbols?.get(symbol)?.loc,
              };
            } else {
              // Otherwise the original asset will be returned at the end.
              break;
            }
          } else {
            // We didn't find it in this dependency, but it might still be there: bailout.
            // Continue searching though, with the assumption that there are no conficting reexports
            // and there might be a another (re)export (where we might statically find the symbol).
            potentialResults.push({
              asset: result.asset,
              symbol: result.symbol,
              exportSymbol: result.exportSymbol,
              loc: resolved.symbols?.get(symbol)?.loc,
            });
          }
        }
      }
    }

    // We didn't find the exact symbol...
    if (potentialResults.length == 1) {
      // ..., but if it does exist, it has to be behind this one reexport.
      return potentialResults[0];
    } else {
      let result = identifier;
      if (skipped) {
        // ... and it was excluded (by symbol propagation) or deferred.
        result = false;
      } else {
        // ... and there is no single reexport, but it might still be exported:
        if (found) {
          // Fallback to namespace access, because of a bundle boundary.
          result = null;
        } else if (result === undefined) {
          // If not exported explicitly by the asset (= would have to be in * or a reexport-all) ...
          if (nonStaticDependency || asset.symbols?.has('*')) {
            // ... and if there are non-statically analyzable dependencies or it's a CJS asset,
            // fallback to namespace access.
            result = null;
          }
          // (It shouldn't be possible for the symbol to be in a reexport-all and to end up here).
          // Otherwise return undefined to report that the symbol wasn't found.
        }
      }

      return {
        asset,
        exportSymbol: symbol,
        symbol: result,
        loc: asset.symbols?.get(symbol)?.loc,
      };
    }
  }

}
