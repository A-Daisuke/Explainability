      let usedExports = [...asset.symbols.exportSymbols()].filter(symbol => {
        if (symbol === '*') {
          return false;
        }

        // If we need default interop, then all symbols are needed because the `default`
        // symbol really maps to the whole namespace.
        if (defaultInterop) {
          return true;
        }

        let unused = incomingDeps.every(d => {
          let symbols = nullthrows(this.bundleGraph.getUsedSymbols(d));
          return !symbols.has(symbol) && !symbols.has('*');
        });
        return !unused;
      });
