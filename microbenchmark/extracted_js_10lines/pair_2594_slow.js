const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 100; ++VAR_2) {
          VAR_1.push([]);
          for (var VAR_3 = 0; VAR_3 < 100; ++VAR_3) VAR_1[VAR_2].push(VAR_2 * VAR_3);
        }
        function FUNCTION_1(VAR_4) {
          return VAR_4 + 1;
        }
        VAR_1.forEach(function (VAR_5, VAR_6) {
          VAR_5.forEach(FUNCTION_1);
        });
    }
};