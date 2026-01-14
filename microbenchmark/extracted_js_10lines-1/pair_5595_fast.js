const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = 1;
          while (VAR_2 > 0) {
            VAR_3 *= VAR_1;
            VAR_2 -= 1;
          }
          return VAR_3;
        }
        function FUNCTION_2(VAR_4, VAR_5) {
          if (VAR_5 === 1) {
            return VAR_4;
          } else if (VAR_5 % 2 === 0) {
            return FUNCTION_2(VAR_4 * VAR_4, VAR_5 / 2);
          } else {
            return VAR_4 * FUNCTION_2(VAR_4, VAR_5 - 1);
          }
        }
        FUNCTION_2(100, 100);
    }
};