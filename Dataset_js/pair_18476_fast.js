const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return arguments[0] + arguments[1] + arguments[2];
        }
        function FUNCTION_2(VAR_1, VAR_2, VAR_3) {
          return VAR_1 + VAR_2 + VAR_3;
        }
        function FUNCTION_3(VAR_4) {
          return VAR_4[0] + VAR_4[1] + VAR_4[2];
        }
        var VAR_7 = [7, 9, 15];
        FUNCTION_3(VAR_7);
    }
};