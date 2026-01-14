const Benchmark = {
    run: function() {
        (function () {
          "use strict";
          const VAR_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          function FUNCTION_1() {
            let VAR_2 = VAR_1[2];
          }
          for (var VAR_3 = 0; VAR_3 < 1000; VAR_3++) {
            FUNCTION_1();
          }
        })();
    }
};