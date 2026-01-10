const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          return (FUNCTION_1.VAR_1 = (FUNCTION_1.VAR_1 + 1) % 100 || 0);
        };
        var VAR_4 = (function () {
          var VAR_5 = 0;
          return function () {
            return (VAR_5 = (VAR_5 + 1) % 100);
          };
        })();
        var VAR_3 = 0;
        var FUNCTION_3 = function () {
          return VAR_3++;
        };
        VAR_4();
    }
};