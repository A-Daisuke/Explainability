const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (Math.abs(VAR_1) / 2 === 0) {
            return true;
          } else {
            return false;
          }
        }
        function FUNCTION_2(VAR_2) {
          if (Math.abs(VAR_2) / 2 !== 0) {
            return true;
          } else {
            return false;
          }
        }
        FUNCTION_1(2);
        FUNCTION_2(2);
        FUNCTION_1(1);
        FUNCTION_2(1);
    }
};