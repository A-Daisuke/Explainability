const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 <= 1) {
            return 1;
          }
          return FUNCTION_1(VAR_1 - 1) + FUNCTION_1(VAR_1 - 2);
        }
        function FUNCTION_2(VAR_2, VAR_3) {
          VAR_3 = VAR_3 || {};
          if (VAR_3[VAR_1]) {
            return VAR_3[VAR_1];
          }
          if (VAR_2 <= 1) {
            return 1;
          }
          return (VAR_3[VAR_4] = FUNCTION_2(VAR_2 - 1, VAR_3) + FUNCTION_2(VAR_2 - 2, VAR_3));
        }
        FUNCTION_1(15);
    }
};