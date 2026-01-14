const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 === 0 || VAR_1 === 1) return VAR_1;
          var VAR_6 = 1,
            VAR_7 = 0,
            VAR_8;
          for (var VAR_9 = 1; VAR_9 < VAR_1; VAR_9++) {
            VAR_8 = VAR_7;
            VAR_7 = VAR_6;
            VAR_6 = VAR_7 + VAR_8;
          }
          return VAR_6;
        }
        function FUNCTION_3(VAR_5) {
          if (VAR_5 === 0 || VAR_5 === 1) return VAR_5;
          return FUNCTION_3(VAR_5 - 1) + FUNCTION_3(VAR_5 - 2);
        }
        FUNCTION_1(1476);
    }
};