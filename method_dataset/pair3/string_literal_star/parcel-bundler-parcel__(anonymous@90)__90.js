function __method_wrapper__() {
      bundle.traverseAssets(asset => {
        if (
          asset.symbols.isCleared ||
          asset.meta.cssModulesCompiled === 'postcss'
        ) {
          return;
        }

        let usedSymbols = bundleGraph.getUsedSymbols(asset);
        if (usedSymbols == null) {
          return;
        }

        let defaultImport = null;
        if (usedSymbols.has('default')) {
          let incoming = bundleGraph.getIncomingDependencies(asset);
          defaultImport = incoming.find(d =>
            d.symbols.hasExportSymbol('default'),
          );
          if (defaultImport) {
            let loc = defaultImport.symbols.get('default')?.loc;
            logger.warn({
              message:
                'CSS modules cannot be tree shaken when imported with a default specifier',
              ...(loc && {
                codeFrames: [
                  {
                    filePath: nullthrows(
                      loc?.filePath ?? defaultImport.sourcePath,
                    ),
                    codeHighlights: [convertSourceLocationToHighlight(loc)],
                  },
                ],
              }),
              hints: [
                `Instead do: import * as style from "${defaultImport.specifier}";`,
              ],
              documentationURL:
                'https://parceljs.org/languages/css/#tree-shaking',
            });
          }
        }

        if (!defaultImport && !usedSymbols.has('*')) {
          for (let [symbol, {local}] of asset.symbols) {
            if (local !== 'default' && !usedSymbols.has(symbol)) {
              unusedSymbols.push(local);
            }
          }
        }
      });

}
