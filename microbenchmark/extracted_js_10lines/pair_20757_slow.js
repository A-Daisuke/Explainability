const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
          return VAR_1 + VAR_2 + VAR_3;
        }
        function FUNCTION_2(VAR_4, VAR_5, VAR_6) {
          void arguments.length;
          return VAR_4 + VAR_5 + VAR_6;
        }
        function FUNCTION_3(VAR_7, VAR_8, VAR_9) {
          return arguments[0] + arguments[1] + arguments[2];
        }
        function FUNCTION_4(VAR_10, VAR_11) {
          return arguments[0] + arguments[1] + arguments[2];
        }
        var VAR_12 = 0;
        VAR_12 += FUNCTION_4(1, 2, 3);
    }
};