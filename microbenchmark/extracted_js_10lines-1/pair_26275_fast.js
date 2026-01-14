const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = VAR_1,
            VAR_4 = VAR_2;
          while ((VAR_4 = VAR_4 - 1)) {
            VAR_3 = VAR_3 * VAR_2;
          }
          return VAR_3;
        }
        function FUNCTION_2(VAR_5, VAR_6) {
          var VAR_7 = VAR_5,
            VAR_8 = VAR_6;
          while (--VAR_8) {
            VAR_7 = VAR_7 * VAR_6;
          }
          return VAR_7;
        }
        Math.pow(10, 10);
    }
};