const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return VAR_1 % 1 === 0;
        }
        function FUNCTION_2(VAR_2) {
          return typeof VAR_2 === "number" && VAR_2 % 1 === 0;
        }
        function FUNCTION_3(VAR_3) {
          return (VAR_3 | 0) === VAR_3;
        }
        function FUNCTION_4(VAR_4) {
          return parseInt(VAR_4, 10) === VAR_4;
        }
        FUNCTION_1(0);
        FUNCTION_1(1);
        FUNCTION_1(1.9);
        FUNCTION_1(true);
        FUNCTION_1(false);
        FUNCTION_1(NaN);
        FUNCTION_1("foo");
        FUNCTION_1("");
    }
};