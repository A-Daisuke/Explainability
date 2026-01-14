const Benchmark = {
    run: function() {
        var VAR_1 = [6, 3, 8, 24, 48, 12, 34, 9, 32, 178, 214];
        var VAR_2 = [1, 5, 6, 7, 8, 9, 10, 15, 20, 25];
        function FUNCTION_1(VAR_3, VAR_4) {
          if (VAR_4 != 0) {
            VAR_3 = VAR_3 + FUNCTION_1(VAR_3 * 10, --VAR_4);
          }
          return VAR_3;
        }
        for (var VAR_5 = 0; VAR_5 < VAR_1.length; VAR_5++) {
          for (var VAR_6 = 0; VAR_6 < VAR_2.length; VAR_6++) {
            FUNCTION_1(VAR_5, VAR_6);
          }
        }
    }
};