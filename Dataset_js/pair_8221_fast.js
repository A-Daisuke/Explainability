const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_6 = 0,
            VAR_7 = VAR_1 / 2;
          while (Math.abs(VAR_6 - VAR_7) > 0.000001) {
            var VAR_8 = (VAR_6 + VAR_7) / 2;
            if (VAR_8 * VAR_8 > VAR_1) {
              VAR_7 = VAR_8;
            } else {
              VAR_6 = VAR_8;
            }
          }
          return Math.round(VAR_6);
        }
        FUNCTION_1(10000000);
    }
};