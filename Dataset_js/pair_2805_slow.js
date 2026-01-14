const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          return Array.apply(null, new Array(VAR_1))
            .map(function (VAR_3, VAR_4) {
              return VAR_4;
            })
            .filter(function (VAR_5) {
              return VAR_2.some(function (VAR_6) {
                return VAR_1 % VAR_6 === 0;
              });
            })
            .reduce(function (VAR_7, VAR_8) {
              return VAR_7 + VAR_1;
            });
        };
        FUNCTION_1(1000, [3, 5]);
    }
};