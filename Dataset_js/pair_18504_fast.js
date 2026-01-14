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
        function FUNCTION_3(VAR_3) {
          if (VAR_3 < 1) {
            return false;
          }
          return (VAR_3 & (VAR_3 - 1)) === 0;
        }
        FUNCTION_3(256);
    }
};