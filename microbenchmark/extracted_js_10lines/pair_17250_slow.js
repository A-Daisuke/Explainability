const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return VAR_1 % 1 === 0;
        }
        function FUNCTION_2(VAR_2) {
          return typeof VAR_2 === "number" && VAR_2 % 1 === 0;
        }
        function FUNCTION_3(VAR_3) {
          return Math.round(VAR_3) === VAR_3;
        }
        function FUNCTION_4(VAR_4) {
          return parseInt(VAR_4, 10) === VAR_4;
        }
        FUNCTION_3(0);
        FUNCTION_3(1);
        FUNCTION_3(1.9);
        FUNCTION_3(true);
        FUNCTION_3(false);
        FUNCTION_3(NaN);
        FUNCTION_3("foo");
        FUNCTION_3("");
    }
};