const Benchmark = {
    run: function() {
        var VAR_1 = 30,
          VAR_2 = 8;
        function FUNCTION_2(VAR_6, VAR_7) {
          var VAR_8 = 1;
          while (VAR_2 > 0) {
            VAR_8 *= VAR_1;
            VAR_2 -= 1;
          }
          return VAR_8;
        }
        FUNCTION_2(VAR_1, VAR_2);
    }
};