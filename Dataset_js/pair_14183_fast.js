const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_5 = 1;
          while (VAR_2 > 0) {
            VAR_5 *= VAR_1;
            VAR_2 -= 1;
          }
          return VAR_5;
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          if (VAR_4 === 1) {
            return VAR_3;
          } else if (VAR_4 % 2 === 0) {
            return FUNCTION_2(VAR_3 * VAR_3, VAR_4 / 2);
          } else {
            return VAR_3 * FUNCTION_2(VAR_3, VAR_4 - 1);
          }
        }
        FUNCTION_1(10, 10);
    }
};