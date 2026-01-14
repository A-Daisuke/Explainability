const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_6 = -1,
            VAR_5 = 0;
          while (VAR_5 != -1) {
            VAR_6++;
            VAR_5 = VAR_1.indexOf(VAR_2, VAR_5 + 1);
          }
          return VAR_6;
        }
        function FUNCTION_2() {
          return new Array(10000).join(Math.random().toString(36) + "\n");
        }
        FUNCTION_1(FUNCTION_2(), "\n");
    }
};