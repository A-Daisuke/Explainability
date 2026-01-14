const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
            return Math.random() * 10 - 5;
          },
          VAR_1 = FUNCTION_1(),
          VAR_2 = FUNCTION_1(),
          VAR_3 = FUNCTION_1(),
          VAR_4 = FUNCTION_1(),
          VAR_5 = FUNCTION_1(),
          VAR_6 = 0;
        VAR_6 = VAR_1 * Math.pow(VAR_5, 3) + VAR_2 * Math.pow(VAR_5, 2) + VAR_3 * VAR_5 + VAR_4;
    }
};