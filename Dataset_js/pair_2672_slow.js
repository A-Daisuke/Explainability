const Benchmark = {
    run: function() {
        "use strict";
        function FUNCTION_1(VAR_1) {
          var VAR_2;
          var VAR_3 = new Array();
          VAR_3.push(0);
          VAR_3.push(1);
          for (VAR_2 = 0; VAR_2 < VAR_1; VAR_2++) {
            VAR_3.push(VAR_3[0] + VAR_3[1]);
            VAR_3.shift();
          }
          return VAR_3[0];
        }
        function FUNCTION_2(VAR_4) {
          if (VAR_4 === 1 || VAR_4 === 2) return 1;
          return FUNCTION_2(VAR_4 - 1) + FUNCTION_2(VAR_4 - 2);
        }
        FUNCTION_2(20);
    }
};