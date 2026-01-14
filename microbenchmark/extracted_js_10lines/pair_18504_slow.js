const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 < 2) {
            return false;
          }
          while (VAR_1 !== 1) {
            if (VAR_1 % 2 !== 0) {
              return false;
            } else {
              VAR_1 /= 2;
            }
          }
          return true;
        }
        function FUNCTION_2(VAR_2) {
          if (VAR_2 == 1) {
            return true;
          } else if (VAR_2 < 1) {
            return false;
          } else {
            return FUNCTION_1(VAR_2 / 2);
          }
        }
        FUNCTION_1(256);
    }
};