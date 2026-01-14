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
        for (var VAR_7 = 0; VAR_2 < 100; ++VAR_2) {
          var VAR_8 = VAR_1[VAR_2];
          for (var VAR_9 = 0; VAR_3 < 100; ++VAR_3) FUNCTION_1(VAR_8[VAR_3]);
        }
    }
};