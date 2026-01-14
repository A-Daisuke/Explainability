const Benchmark = {
    run: function() {
        var VAR_1 = 30,
          VAR_2 = 8;
        var VAR_3 = {};
        function FUNCTION_1(VAR_4, VAR_5) {
          if (typeof VAR_3[VAR_1 + "-" + VAR_2] !== "undefined") {
            return VAR_3[VAR_1 + "-" + VAR_2];
          }
          VAR_3[VAR_1 + "-" + VAR_2] = FUNCTION_2(VAR_1, VAR_2);
          return VAR_3[VAR_1 + "-" + VAR_2];
        }
        function FUNCTION_2(VAR_6, VAR_7) {
          var VAR_8 = 1;
          while (VAR_2 > 0) {
            VAR_8 *= VAR_1;
            VAR_2 -= 1;
          }
          return VAR_8;
        }
        FUNCTION_1(VAR_1, VAR_2);
    }
};