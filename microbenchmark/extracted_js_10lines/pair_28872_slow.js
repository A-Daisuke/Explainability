const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 50; VAR_2++) {
          VAR_1.push(VAR_2);
        }
        function FUNCTION_1(VAR_3) {
          return VAR_2 * 2;
        }
        function FUNCTION_2(VAR_4, VAR_5) {
          for (var VAR_6 = 0; VAR_2 < VAR_4.length; VAR_2++) {
            VAR_5(VAR_4[VAR_2], VAR_2);
          }
        }
        FUNCTION_2(VAR_1, function (VAR_7) {
          FUNCTION_1(VAR_7);
        });
    }
};