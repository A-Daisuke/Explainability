const Benchmark = {
    run: function() {
        var VAR_1 = 380,
          VAR_2 = 380,
          VAR_3 = 11,
          VAR_4 = 18;
        function FUNCTION_1(VAR_5) {
          if (
            VAR_5 % 11 === 0 &&
            VAR_5 % 12 === 0 &&
            VAR_5 % 13 === 0 &&
            VAR_5 % 14 === 0 &&
            VAR_5 % 15 === 0 &&
            VAR_5 % 16 === 0 &&
            VAR_5 % 17 === 0 &&
            VAR_5 % 18 === 0
          ) {
            return true;
          }
          return false;
        }
        function FUNCTION_2() {
          while (FUNCTION_1(VAR_1) === false) {
            VAR_1 += VAR_2;
          }
        }
        FUNCTION_2();
    }
};