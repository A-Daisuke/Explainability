function __method_wrapper__() {
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
