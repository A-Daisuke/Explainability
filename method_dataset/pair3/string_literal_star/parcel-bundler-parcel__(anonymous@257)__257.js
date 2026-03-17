function __method_wrapper__() {
    (assetNode, incomingDeps, outgoingDeps) => {
      let assetSymbols: ?$ReadOnlyMap<
        Symbol,
        {|local: Symbol, loc: ?InternalSourceLocation, meta?: ?Meta|},
      > = assetNode.value.symbols;

      let assetSymbolsInverse = null;
      if (assetSymbols) {
        assetSymbolsInverse = new Map<Symbol, Set<Symbol>>();
        for (let [s, {local}] of assetSymbols) {
          let set = assetSymbolsInverse.get(local);
          if (!set) {
            set = new Set();
            assetSymbolsInverse.set(local, set);
          }
          set.add(s);
        }
      }

      // the symbols that are reexported (not used in `asset`) -> asset they resolved to
      let reexportedSymbols = new Map<
        Symbol,
        ?{|asset: ContentKey, symbol: ?Symbol|},
      >();
      // the symbols that are reexported (not used in `asset`) -> the corresponding outgoingDep(s)
      // To generate the diagnostic when there are multiple dependencies with non-statically
      // analyzable exports
      let reexportedSymbolsSource = new Map<Symbol, DependencyNode>();
      for (let outgoingDep of outgoingDeps) {
        let outgoingDepSymbols = outgoingDep.value.symbols;
        if (!outgoingDepSymbols) continue;

        let isExcluded =
          assetGraph.getNodeIdsConnectedFrom(
            assetGraph.getNodeIdByContentKey(outgoingDep.id),
          ).length === 0;
        // excluded, assume everything that is requested exists
        if (isExcluded) {
          outgoingDep.usedSymbolsDown.forEach((_, s) =>
            outgoingDep.usedSymbolsUp.set(s, null),
          );
        }

        if (outgoingDepSymbols.get('*')?.local === '*') {
          outgoingDep.usedSymbolsUp.forEach((sResolved, s) => {
            if (s === 'default') {
              return;
            }

            // If the symbol could come from multiple assets at runtime, assetNode's
            // namespace will be needed at runtime to perform the lookup on.
            if (reexportedSymbols.has(s)) {
              if (!assetNode.usedSymbols.has('*')) {
                logFallbackNamespaceInsertion(
                  assetNode,
                  s,
                  nullthrows(reexportedSymbolsSource.get(s)),
                  outgoingDep,
                );
              }
              assetNode.usedSymbols.add('*');
              reexportedSymbols.set(s, {asset: assetNode.id, symbol: s});
            } else {
              reexportedSymbols.set(s, sResolved);
              reexportedSymbolsSource.set(s, outgoingDep);
            }
          });
        }

        for (let [s, sResolved] of outgoingDep.usedSymbolsUp) {
          if (!outgoingDep.usedSymbolsDown.has(s)) {
            // usedSymbolsDown is a superset of usedSymbolsUp
            continue;
          }

          let local = outgoingDepSymbols.get(s)?.local;

          if (local == null) {
            // Caused by '*' => '*', already handled
            continue;
          }

          let reexported = assetSymbolsInverse?.get(local);
          if (reexported != null) {
            reexported.forEach(s => {
              // see same code above
              if (reexportedSymbols.has(s)) {
                if (!assetNode.usedSymbols.has('*')) {
                  logFallbackNamespaceInsertion(
                    assetNode,
                    s,
                    nullthrows(reexportedSymbolsSource.get(s)),
                    outgoingDep,
                  );
                }
                assetNode.usedSymbols.add('*');
                reexportedSymbols.set(s, {asset: assetNode.id, symbol: s});
              } else {
                reexportedSymbols.set(s, sResolved);
                reexportedSymbolsSource.set(s, outgoingDep);
              }
            });
          }
        }
      }

      let errors: Array<Diagnostic> = [];

      function usedSymbolsUpAmbiguous(old, current, s, value) {
        if (old.has(s)) {
          let valueOld = old.get(s);
          if (
            valueOld !== value &&
            !(
              valueOld?.asset === value.asset &&
              valueOld?.symbol === value.symbol
            )
          ) {
            // The dependency points to multiple assets (via an asset group).
            current.set(s, undefined);
            return;
          }
        }
        current.set(s, value);
      }

      for (let incomingDep of incomingDeps) {
        let incomingDepUsedSymbolsUpOld = incomingDep.usedSymbolsUp;
        incomingDep.usedSymbolsUp = new Map();
        let incomingDepSymbols = incomingDep.value.symbols;
        if (!incomingDepSymbols) continue;

        let hasNamespaceReexport = incomingDepSymbols.get('*')?.local === '*';
        for (let s of incomingDep.usedSymbolsDown) {
          if (
            assetSymbols == null || // Assume everything could be provided if symbols are cleared
            assetNode.value.bundleBehavior === BundleBehavior.isolated ||
            assetNode.value.bundleBehavior === BundleBehavior.inline ||
            s === '*' ||
            assetNode.usedSymbols.has(s)
          ) {
            usedSymbolsUpAmbiguous(
              incomingDepUsedSymbolsUpOld,
              incomingDep.usedSymbolsUp,
              s,
              {
                asset: assetNode.id,
                symbol: s,
              },
            );
          } else if (reexportedSymbols.has(s)) {
            let reexport = reexportedSymbols.get(s);
            let v =
              // Forward a reexport only if the current asset is side-effect free and not external
              !assetNode.value.sideEffects && reexport != null
                ? reexport
                : {
                    asset: assetNode.id,
                    symbol: s,
                  };
            usedSymbolsUpAmbiguous(
              incomingDepUsedSymbolsUpOld,
              incomingDep.usedSymbolsUp,
              s,
              v,
            );
          } else if (!hasNamespaceReexport) {
            let loc = incomingDep.value.symbols?.get(s)?.loc;
            let [resolutionNodeId] = assetGraph.getNodeIdsConnectedFrom(
              assetGraph.getNodeIdByContentKey(incomingDep.id),
            );
            let resolution = nullthrows(assetGraph.getNode(resolutionNodeId));
            invariant(
              resolution &&
                (resolution.type === 'asset_group' ||
                  resolution.type === 'asset'),
            );

            errors.push({
              message: md`${fromProjectPathRelative(
                resolution.value.filePath,
              )} does not export '${s}'`,
              origin: '@parcel/core',
              codeFrames: loc
                ? [
                    {
                      filePath:
                        fromProjectPath(options.projectRoot, loc?.filePath) ??
                        undefined,
                      language: incomingDep.value.sourceAssetType ?? undefined,
                      codeHighlights: [convertSourceLocationToHighlight(loc)],
                    },
                  ]
                : undefined,
            });
          }
        }

        if (!equalMap(incomingDepUsedSymbolsUpOld, incomingDep.usedSymbolsUp)) {
          changedDeps.add(incomingDep);
          incomingDep.usedSymbolsUpDirtyUp = true;
        }

        incomingDep.excluded = false;
        if (
          incomingDep.value.symbols != null &&
          incomingDep.usedSymbolsUp.size === 0
        ) {
          let assetGroups = assetGraph.getNodeIdsConnectedFrom(
            assetGraph.getNodeIdByContentKey(incomingDep.id),
          );
          if (assetGroups.length === 1) {
            let [assetGroupId] = assetGroups;
            let assetGroup = nullthrows(assetGraph.getNode(assetGroupId));
            if (
              assetGroup.type === 'asset_group' &&
              assetGroup.value.sideEffects === false
            ) {
              incomingDep.excluded = true;
            }
          } else {
            invariant(assetGroups.length === 0);
          }
        }
      }
      return errors;
    },

}
