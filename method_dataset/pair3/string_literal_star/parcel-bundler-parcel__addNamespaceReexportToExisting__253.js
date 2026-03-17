    function addNamespaceReexportToExisting(state) {
      let n1 = getRandomModuleIndex(state);
      let n2 = getRandomModuleIndex(state);
      if (n1 >= n2) return state;

      let as = Math.random() > 0.5 ? getNewExportName() : '*';

      return appendToModule(state, n1, {
        exported: [
          {
            from: n2,
            symbol: '*',
            as,
          },
        ],
      });
    },
