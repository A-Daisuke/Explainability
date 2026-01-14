const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [];
        for (var VAR_3 = 1; VAR_3 <= 10; VAR_3++) {
          VAR_1.push(VAR_3);
        }
        for (var VAR_4 = 1; VAR_3 <= 1000000; VAR_3++) {
          VAR_2.push(VAR_3);
        }
        VAR_1.forEach(function (VAR_5, VAR_6) {
          if (VAR_5 === 1) {
            return;
          }
        });
    }
};