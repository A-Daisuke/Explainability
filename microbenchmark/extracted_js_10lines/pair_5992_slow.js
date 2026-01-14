const Benchmark = {
    run: function() {
        var VAR_1 = [
          [1, 100],
          [-123, 4],
          [5.619, 7],
          [1234567890, 2],
        ];
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_4 = new Array(1 + VAR_3).join("0");
          return (VAR_4 + VAR_2).slice(-VAR_4.length);
        }
        FUNCTION_1(VAR_1[0][0], VAR_1[0][1]);
        FUNCTION_1(VAR_1[1][0], VAR_1[1][1]);
        FUNCTION_1(VAR_1[2][0], VAR_1[2][1]);
        FUNCTION_1(VAR_1[3][0], VAR_1[3][1]);
    }
};