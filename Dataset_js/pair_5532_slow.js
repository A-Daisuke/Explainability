const Benchmark = {
    run: function() {
        const FUNCTION_1 = function (VAR_1) {
          return VAR_1.reduce(function (VAR_2, VAR_3) {
            if (Array.isArray(VAR_3)) {
              VAR_2 = VAR_2.concat(FUNCTION_1(VAR_3));
            } else {
              VAR_2.push(VAR_3);
            }
            return VAR_2;
          }, []);
        };
        var VAR_4 = ["gamma", ["alpha", ["beta"]], [[["delta"]]]];
        FUNCTION_1(VAR_4).sort();
    }
};