const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 100; VAR_2++) {
          var VAR_3 = [];
          for (var VAR_4 = 0; VAR_4 < 1000; VAR_4++) {
            VAR_3.push(VAR_4);
          }
          VAR_1.push(VAR_3);
        }
        VAR_1.reduce(function (VAR_5, VAR_6) {
          VAR_5.push(...VAR_3);
          return VAR_5;
        }, []);
    }
};