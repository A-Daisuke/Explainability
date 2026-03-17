function __method_wrapper__() {
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

}
