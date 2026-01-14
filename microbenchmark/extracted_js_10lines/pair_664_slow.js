const Benchmark = {
    run: function() {
        var VAR_1 = 380,
          VAR_2 = 380,
          VAR_3 = 11,
          VAR_4 = 18;
        function FUNCTION_1(VAR_5) {
          for (var VAR_6 = VAR_4; VAR_6 >= VAR_3; VAR_6--) {
            if (VAR_5 % VAR_6 !== 0) {
              return false;
            }
          }
          return true;
        }
        function FUNCTION_2() {
          while (FUNCTION_1(VAR_1) === false) {
            VAR_1 += VAR_2;
          }
        }
        FUNCTION_2();
    }
};