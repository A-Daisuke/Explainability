const Benchmark = {
    run: function() {
        const FUNCTION_1 = function (VAR_2, VAR_5 = []) {
          for (let VAR_6 = 0, VAR_7 = VAR_2.VAR_7; VAR_6 < VAR_7; VAR_6++) {
            const VAR_8 = VAR_2[VAR_6];
            if (Array.isArray(VAR_8)) {
              FUNCTION_1(VAR_8, VAR_5);
            } else {
              VAR_5.push(VAR_8);
            }
          }
          return VAR_5;
        };
        var VAR_4 = ["gamma", ["alpha", ["beta"]], [[["delta"]]]];
        FUNCTION_1(VAR_4).sort();
    }
};