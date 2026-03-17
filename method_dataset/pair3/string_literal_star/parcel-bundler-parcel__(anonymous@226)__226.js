    let depNodes = targets.map(target => {
      // In library mode, all of the entry's symbols are "used"
      // In non-browser environments, exports may also be used (e.g. serverless request handlers).
      let includeAllSymbols =
        target.env.isLibrary || !BROWSER_ENVS.has(target.env.context);
      let node = nodeFromDep(
        // The passed project path is ignored in this case, because there is no `loc`
        createDependency('', {
          specifier: fromProjectPathRelative(entry.filePath),
          specifierType: 'esm', // ???
          pipeline: target.pipeline,
          target: target,
          env: target.env,
          isEntry: true,
          needsStableName: true,
          symbols: includeAllSymbols
            ? new Map([['*', {local: '*', isWeak: true, loc: null}]])
            : undefined,
        }),
      );

      if (includeAllSymbols) {
        node.usedSymbolsDown.add('*');
        node.usedSymbolsUp.set('*', undefined);
      }
      return node;
    });
