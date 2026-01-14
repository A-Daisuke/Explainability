const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          function FUNCTION_2(VAR_2, VAR_3) {
            do {
              if (VAR_2 == 0) {
                return VAR_3;
              } else {
                VAR_3 = VAR_3 * VAR_2;
                VAR_2 = VAR_2 - 1;
              }
            } while (1);
          }
          return FUNCTION_2(VAR_1, 1);
        }
        FUNCTION_1(100);
    }
};