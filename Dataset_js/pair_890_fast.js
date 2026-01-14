const Benchmark = {
    run: function() {
        var VAR_1 = 1000;
        var VAR_2;
        var FUNCTION_1 = function (VAR_3) {
          return (VAR_3 + VAR_3) * VAR_3;
        };
        var VAR_6, VAR_7;
        for (VAR_6 = 0; VAR_6 < VAR_1; VAR_6++) {
          for (VAR_7 = 0; VAR_7 < VAR_1; VAR_7++) {
            VAR_2 = FUNCTION_1(VAR_6 * VAR_1 + VAR_7);
          }
        }
    }
};