const Benchmark = {
    run: function() {
        var VAR_1;
        var VAR_2;
        var VAR_3;
        function FUNCTION_1(VAR_4, VAR_5) {
          return function () {
            VAR_1 += VAR_4 + VAR_5;
          };
        }
        function FUNCTION_2(VAR_6, VAR_7, VAR_8, VAR_9) {
          VAR_2 = FUNCTION_1(VAR_6, VAR_7);
          VAR_3 = FUNCTION_1(VAR_8, VAR_9);
        }
        FUNCTION_2(1, 2, 3, 4);
    }
};