const Benchmark = {
    run: function() {
        var VAR_1;
        function FUNCTION_1() {
          return VAR_1;
        }
        var FUNCTION_2 = function () {
          if (!VAR_1) {
            VAR_1 = 1;
            FUNCTION_2 = FUNCTION_1;
          }
          return FUNCTION_1();
        };
        var VAR_2 = 0;
        for (var VAR_3 = 0; VAR_3 < 10000; VAR_3++) VAR_2 += FUNCTION_2();
        VAR_2;
    }
};