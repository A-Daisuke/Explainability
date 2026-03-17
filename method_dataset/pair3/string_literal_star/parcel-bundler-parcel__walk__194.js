    function walk(nodeId) {
      if (walkVisited.has(nodeId)) return;
      walkVisited.add(nodeId);

      let node = nullthrows(assetGraph.getNode(nodeId));
      if (
        node.type === 'dependency' &&
        node.value.symbols != null &&
        // Disable in dev mode because this feature is at odds with safeToIncrementallyBundle
        isProduction
      ) {
        let nodeValueSymbols = node.value.symbols;

        // asset -> symbols that should be imported directly from that asset
        let targets = new DefaultMap<ContentKey, Map<Symbol, Symbol>>(
          () => new Map(),
        );
        let externalSymbols = new Set();
        let hasAmbiguousSymbols = false;

        for (let [symbol, resolvedSymbol] of node.usedSymbolsUp) {
          if (resolvedSymbol) {
            targets
              .get(resolvedSymbol.asset)
              .set(symbol, resolvedSymbol.symbol ?? symbol);
          } else if (resolvedSymbol === null) {
            externalSymbols.add(symbol);
          } else if (resolvedSymbol === undefined) {
            hasAmbiguousSymbols = true;
            break;
          }
        }

        if (
          // Only perform retargeting when there is an imported symbol
          // - If the target is side-effect-free, the symbols point to the actual target and removing
          //   the original dependency resolution is fine
          // - Otherwise, keep this dependency unchanged for its potential side effects
          node.usedSymbolsUp.size > 0 &&
          // Only perform retargeting if the dependency only points to a single asset (e.g. CSS modules)
          !hasAmbiguousSymbols &&
          // It doesn't make sense to retarget dependencies where `*` is used, because the
          // retargeting won't enable any benefits in that case (apart from potentially even more
          // code being generated).
          !node.usedSymbolsUp.has('*') &&
          // TODO We currently can't rename imports in async imports, e.g. from
          //      (parcelRequire("...")).then(({ a }) => a);
          // to
          //      (parcelRequire("...")).then(({ a: b }) => a);
          // or
          //      (parcelRequire("...")).then((a)=>a);
          // if the reexporting asset did `export {a as b}` or `export * as a`
          node.value.priority === Priority.sync &&
          // For every asset, no symbol is imported multiple times (with a different local name).
          // Don't retarget because this cannot be resolved without also changing the asset symbols
          // (and the asset content itself).
          [...targets].every(
            ([, t]) => new Set([...t.values()]).size === t.size,
          )
        ) {
          let isReexportAll = nodeValueSymbols.get('*')?.local === '*';
          let reexportAllLoc = isReexportAll
            ? nullthrows(nodeValueSymbols.get('*')).loc
            : undefined;

          // TODO adjust sourceAssetIdNode.value.dependencies ?
          let deps = [
            // Keep the original dependency
            {
              asset: null,
              dep: graph.addNodeByContentKey(node.id, {
                ...node,
                value: {
                  ...node.value,
                  symbols: new Map(
                    [...nodeValueSymbols].filter(([k]) =>
                      externalSymbols.has(k),
                    ),
                  ),
                },
                usedSymbolsUp: new Map(
                  [...node.usedSymbolsUp].filter(([k]) =>
                    externalSymbols.has(k),
                  ),
                ),
                usedSymbolsDown: new Set(),
                excluded: externalSymbols.size === 0,
              }),
            },
            ...[...targets].map(([asset, target]) => {
              let newNodeId = hashString(
                node.id + [...target.keys()].join(','),
              );

              let symbols = new Map();
              for (let [as, from] of target) {
                let existing = nodeValueSymbols.get(as);
                if (existing) {
                  symbols.set(from, {...existing, meta: {rewritten: as}});
                } else {
                  invariant(isReexportAll);
                  if (as === from) {
                    // Keep the export-all for non-renamed reexports, this still correctly models
                    // ambiguous resolution with multiple export-alls.
                    symbols.set('*', {
                      isWeak: true,
                      local: '*',
                      loc: reexportAllLoc,
                    });
                  } else {
                    let local = `${node.value.id}$rewrite$${asset}$${from}`;
                    symbols.set(from, {
                      isWeak: true,
                      local,
                      loc: reexportAllLoc,
                    });
                    if (node.value.sourceAssetId != null) {
                      let sourceAssetId = nullthrows(
                        assetGraphNodeIdToBundleGraphNodeId.get(
                          assetGraph.getNodeIdByContentKey(
                            node.value.sourceAssetId,
                          ),
                        ),
                      );
                      let sourceAsset = nullthrows(
                        graph.getNode(sourceAssetId),
                      );
                      invariant(sourceAsset.type === 'asset');
                      let sourceAssetSymbols = sourceAsset.value.symbols;
                      if (sourceAssetSymbols) {
                        // The `as == from` case above should handle multiple export-alls causing
                        // ambiguous resolution. So the current symbol is unambiguous and shouldn't
                        // already exist on the importer.
                        invariant(!sourceAssetSymbols.has(as));
                        sourceAssetSymbols.set(as, {
                          loc: reexportAllLoc,
                          local: local,
                        });
                      }
                    }
                  }
                }
              }
              let usedSymbolsUp = new Map(
                [...node.usedSymbolsUp]
                  .filter(([k]) => target.has(k) || k === '*')
                  .map(([k, v]) => [target.get(k) ?? k, v]),
              );
              return {
                asset,
                dep: graph.addNodeByContentKey(newNodeId, {
                  ...node,
                  id: newNodeId,
                  value: {
                    ...node.value,
                    id: newNodeId,
                    symbols,
                  },
                  usedSymbolsUp,
                  // This is only a temporary helper needed during symbol propagation and is never
                  // read afterwards (and also not exposed through the public API).
                  usedSymbolsDown: new Set(),
                }),
              };
            }),
          ];

          dependencies.set(nodeId, deps);

          // Jump to the dependencies that are used in this dependency
          for (let id of targets.keys()) {
            walk(assetGraph.getNodeIdByContentKey(id));
          }
          return;
        } else {
          // No special handling
          let bundleGraphNodeId = graph.addNodeByContentKey(node.id, node);
          assetGraphNodeIdToBundleGraphNodeId.set(nodeId, bundleGraphNodeId);
        }
      }
      // Don't copy over asset groups into the bundle graph.
      else if (node.type !== 'asset_group') {
        let nodeToAdd =
          node.type === 'asset'
            ? {
                ...node,
                value: {...node.value, symbols: new Map(node.value.symbols)},
              }
            : node;
        let bundleGraphNodeId = graph.addNodeByContentKey(node.id, nodeToAdd);
        if (node.id === assetGraphRootNode?.id) {
          graph.setRootNodeId(bundleGraphNodeId);
        }
        assetGraphNodeIdToBundleGraphNodeId.set(nodeId, bundleGraphNodeId);
      }

      for (let id of assetGraph.getNodeIdsConnectedFrom(nodeId)) {
        walk(id);
      }
    }
