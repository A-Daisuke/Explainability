const Benchmark = {
    run: function() {
        const FUNCTION_1 = (VAR_1, VAR_2 = {}) => {
          let VAR_3 = VAR_1;
          if (VAR_2.KEY_1) VAR_3 += `/${VAR_2.KEY_1}`;
          if (VAR_2.KEY_2) {
            VAR_3 += `/${VAR_2.KEY_2.KEY_3}`;
            if (VAR_2.KEY_2.KEY_4) VAR_3 += `/${VAR_2.KEY_2.KEY_4}`;
          }
          return `/top-${VAR_3}/`;
        };
        FUNCTION_1("clipes", {
          KEY_2: {
            KEY_3: "mg",
            KEY_4: "belo-horizonte",
          },
          KEY_1: "rock",
        });
    }
};