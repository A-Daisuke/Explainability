const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
          void arguments.length;
          return VAR_1 + VAR_2 + VAR_3;
        }
        function FUNCTION_2() {
          return arguments[0] + arguments[1] + arguments[2];
        }
        function FUNCTION_3(VAR_4, VAR_5, VAR_6) {
          return arguments[0] + arguments[1] + arguments[2];
        }
        function FUNCTION_4(VAR_7, VAR_8) {
          return arguments[0] + arguments[1] + arguments[2];
        }
        var VAR_9 = 0;
        VAR_9 += FUNCTION_3(1, 2, 3);
    }
};