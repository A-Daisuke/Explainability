const Benchmark = {
    run: function() {
        var FUNCTION_2 = function () {
          return Math.random().toString(36);
        };
        var FUNCTION_1 = function () {
          return Math.random().toString(36).substr(2, 16);
        };
        var FUNCTION_3 = function () {
          return Math.random().toString().substr(2);
        };
        FUNCTION_1();
    }
};