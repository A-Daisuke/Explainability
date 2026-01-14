const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          var VAR_2 = new Array(1000).join("x");
          return VAR_2[VAR_1];
        };
        var VAR_3 = (function (VAR_4) {
          var VAR_5 = new Array(1000).join("x");
          return function (VAR_6) {
            return VAR_2[VAR_1];
          };
        })();
        FUNCTION_1(3);
    }
};