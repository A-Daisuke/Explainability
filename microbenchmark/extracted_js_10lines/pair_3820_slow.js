const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
          VAR_1.push(VAR_2);
        }
        function FUNCTION_1(VAR_3, VAR_4) {
          var VAR_5 = VAR_1.VAR_5;
          for (var VAR_6 = 0; VAR_2 < VAR_5; VAR_2++) {
            VAR_4(VAR_1[VAR_2], VAR_2);
          }
        }
        var VAR_7 = 0;
        VAR_1.forEach(function (VAR_8) {
          VAR_7 += VAR_8;
        });
    }
};