const Benchmark = {
    run: function() {
        var VAR_1 = [
          ["a", 10000],
          ["abcdef", 10000],
          [123456, 10000],
          ["abc123def567", 10000],
        ];
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_4 = "";
          for (var VAR_5 = 0; VAR_5 < VAR_3; VAR_5++) {
            VAR_4 = VAR_4 + VAR_2;
          }
          return VAR_4;
        }
        FUNCTION_1(VAR_1[0][0], VAR_1[0][1]);
        FUNCTION_1(VAR_1[1][0], VAR_1[1][1]);
        FUNCTION_1(VAR_1[2][0], VAR_1[2][1]);
        FUNCTION_1(VAR_1[3][0], VAR_1[3][1]);
    }
};