const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          var VAR_1 = new Date();
          FUNCTION_1 = function () {
            return VAR_1;
          };
          return FUNCTION_1();
        };
        for (var VAR_2 = 0; VAR_2 <= 10000; VAR_2++) {
          FUNCTION_1();
        }
    }
};