const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          VAR_1 = Math.abs(VAR_1);
          return VAR_1 === 0 || !!(VAR_1 && !(VAR_1 % 2));
        }
        function FUNCTION_2(VAR_2) {
          return FUNCTION_1(Math.abs(VAR_2) + 1);
        }
        FUNCTION_1(2);
        FUNCTION_2(2);
        FUNCTION_1(1);
        FUNCTION_2(1);
    }
};