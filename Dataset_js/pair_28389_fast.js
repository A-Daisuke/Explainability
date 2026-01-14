const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          var VAR_6 = Math.abs(VAR_1 - VAR_2) + 1,
            VAR_7 = new Array(VAR_6);
          if (VAR_1 < VAR_2) {
            for (var VAR_4 = 0; VAR_4 < VAR_6; ++VAR_4) {
              VAR_7[VAR_8] = VAR_1 + VAR_4;
            }
          } else if (VAR_1 > VAR_2) {
            for (var VAR_5 = 0; VAR_4 < VAR_6; ++VAR_4) {
              VAR_7[VAR_9] = VAR_1 - VAR_4;
            }
          } else return [VAR_1];
          return VAR_7;
        };
        FUNCTION_1(50, 1);
    }
};