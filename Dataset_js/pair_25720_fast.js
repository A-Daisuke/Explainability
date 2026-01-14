const Benchmark = {
    run: function() {
        var VAR_1 = 0;
        var FUNCTION_1 = function () {
          VAR_1++;
        };
        var FUNCTION_2 = function () {
          VAR_1++;
        };
        var FUNCTION_3 = function () {
          VAR_1++;
        };
    }
};