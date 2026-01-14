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
          return VAR_5 === 1 ? VAR_4 : VAR_4 * FUNCTION_2(VAR_4, VAR_5 - 1);
        }
        FUNCTION_2(100, 100);
    }
};