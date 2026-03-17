async function processCSSModule(
  options,
  logger,
  bundleGraph,
  bundle,
  asset,
): Promise<[Asset, string, ?SourceMap]> {
  let postcss: PostCSS = await options.packageManager.require(
    'postcss',
    options.projectRoot + '/index',
    {
      range: '^8.4.5',
      saveDev: true,
      shouldAutoInstall: options.shouldAutoInstall,
    },
  );

  let ast: Root = postcss.fromJSON(nullthrows((await asset.getAST())?.program));

  let usedSymbols = bundleGraph.getUsedSymbols(asset);
  if (usedSymbols != null) {
    let localSymbols = new Set(
      [...asset.symbols].map(([, {local}]) => `.${local}`),
    );

    let defaultImport = null;
    if (usedSymbols.has('default')) {
      let incoming = bundleGraph.getIncomingDependencies(asset);
      defaultImport = incoming.find(d => d.symbols.hasExportSymbol('default'));
      if (defaultImport) {
        let loc = defaultImport.symbols.get('default')?.loc;
        logger.warn({
          message:
            'CSS modules cannot be tree shaken when imported with a default specifier',
          ...(loc && {
            codeFrames: [
              {
                filePath: nullthrows(loc?.filePath ?? defaultImport.sourcePath),
                codeHighlights: [convertSourceLocationToHighlight(loc)],
              },
            ],
          }),
          hints: [
            `Instead do: import * as style from "${defaultImport.specifier}";`,
          ],
          documentationURL: 'https://parceljs.org/languages/css/#tree-shaking',
        });
      }
    }

    if (!defaultImport && !usedSymbols.has('*')) {
      let usedLocalSymbols = new Set(
        [...usedSymbols].map(
          exportSymbol =>
            `.${nullthrows(asset.symbols.get(exportSymbol)).local}`,
        ),
      );
      ast.walkRules(rule => {
        if (
          localSymbols.has(rule.selector) &&
          !usedLocalSymbols.has(rule.selector)
        ) {
          rule.remove();
        }
      });
    }
  }

  let {content, map} = await postcss().process(ast, {
    from: undefined,
    to: options.projectRoot + '/index',
    map: {
      annotation: false,
      inline: false,
    },
    // Pass postcss's own stringifier to it to silence its warning
    // as we don't want to perform any transformations -- only generate
    stringifier: postcss.stringify,
  });

  let sourceMap;
  if (bundle.env.sourceMap && map != null) {
    sourceMap = new SourceMap(options.projectRoot);
    sourceMap.addVLQMap(map.toJSON());
  }

  return [asset, content, sourceMap];
}
