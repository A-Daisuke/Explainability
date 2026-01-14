const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
          if (VAR_1 === 0) return VAR_3;
          return FUNCTION_1(VAR_1 - 1, VAR_3 + VAR_2, VAR_2);
        }
        function FUNCTION_2(VAR_4) {
          return FUNCTION_1(VAR_4, 1, 0);
        }
        function FUNCTION_3(VAR_5) {
          if (VAR_5 === 0 || VAR_5 === 1) return VAR_5;
          return FUNCTION_3(VAR_5 - 1) + FUNCTION_3(VAR_5 - 2);
        }
        FUNCTION_2(500);
    }
};