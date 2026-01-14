const Benchmark = {
    run: function() {
        var VAR_1 = [
          [1, 100],
          [-123, 4],
          [5.619, 7],
          [1234567890, 2],
        ];
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_5 = Math.abs(VAR_2);
          var VAR_6 = Math.max(0, VAR_3 - Math.floor(VAR_5).toString().length);
          var VAR_7 = Math.pow(10, VAR_6).toString().substr(1);
          if (VAR_2 < 0) {
            VAR_7 = "-" + VAR_7;
          }
          return VAR_7 + VAR_5;
        }
        FUNCTION_1(VAR_1[0][0], VAR_1[0][1]);
        FUNCTION_1(VAR_1[1][0], VAR_1[1][1]);
        FUNCTION_1(VAR_1[2][0], VAR_1[2][1]);
        FUNCTION_1(VAR_1[3][0], VAR_1[3][1]);
    }
};