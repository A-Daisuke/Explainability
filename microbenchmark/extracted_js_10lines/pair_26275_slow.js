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
        (function (VAR_9, VAR_10) {
          var VAR_11 = VAR_9,
            VAR_12 = VAR_10;
          while ((VAR_12 = VAR_12 - 1)) {
            VAR_11 = VAR_11 * VAR_10;
          }
          return VAR_11;
        })(10, 10);
    }
};