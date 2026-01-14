const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1,
            VAR_3,
            VAR_4;
          while (VAR_1--) {
            VAR_3 = {
              KEY_1: VAR_1,
              KEY_2: VAR_3,
            };
          }
          while (VAR_2--) {
            VAR_4 = VAR_3.KEY_1;
            VAR_3 = VAR_3.KEY_2;
          }
        }
        FUNCTION_1(10);
    }
};