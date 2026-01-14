const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          return (FUNCTION_1.VAR_1 = (FUNCTION_1.VAR_1 + 1) % 100 || 0);
        };
        var FUNCTION_2 = function () {
          FUNCTION_2.VAR_2 = FUNCTION_2.VAR_1 || 0;
          return FUNCTION_2.VAR_1++;
        };
        var VAR_3 = 0;
        var FUNCTION_3 = function () {
          return VAR_3++;
        };
        FUNCTION_2();
    }
};