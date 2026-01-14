const Benchmark = {
    run: function() {
        "use strict";
        function FUNCTION_1(VAR_1) {
          return VAR_1 % 1 === 0;
        }
        function FUNCTION_2(VAR_2) {
          return (VAR_2 ^ 0) === VAR_2;
        }
        function FUNCTION_3(VAR_3) {
          return Math.round(VAR_3) === VAR_3;
        }
        function FUNCTION_4(VAR_4) {
          return VAR_4 % 1 === 0 && typeof VAR_4 === "number";
        }
        FUNCTION_4(1);
        FUNCTION_4("1");
        FUNCTION_4(1.23);
        FUNCTION_4("fish");
    }
};