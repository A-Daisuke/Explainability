const Benchmark = {
    run: function() {
        var VAR_1 = {};
        function FUNCTION_1(VAR_2, VAR_3, VAR_4, VAR_5) {
          return VAR_2 + VAR_3 + VAR_4 + VAR_5;
        }
        function FUNCTION_2(VAR_6, VAR_7, VAR_8, VAR_9) {
          "use strict";
          return VAR_6 + VAR_7 + VAR_8 + VAR_9;
        }
        for (var VAR_10 = 0; VAR_10 < 100; VAR_10++) {
          VAR_11 = FUNCTION_2.call(null, 1, 2, 3, 4);
        }
    }
};