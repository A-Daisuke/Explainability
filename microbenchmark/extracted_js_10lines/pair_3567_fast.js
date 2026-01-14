const Benchmark = {
    run: function() {
        function FUNCTION_2() {
          if (FUNCTION_2.VAR_3) {
            return FUNCTION_2.VAR_3;
          }
          FUNCTION_2.VAR_3 = new Date();
          return FUNCTION_2.VAR_3;
        }
        for (var VAR_2 = 0; VAR_2 <= 10000; VAR_2++) {
          FUNCTION_2();
        }
    }
};