const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2;
        for (var VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1.push([]);
        }
        for (var VAR_5 = 0; VAR_3 < 100; ++VAR_3) {
          for (var VAR_9 = 0; VAR_9 < 10; ++VAR_9) {
            VAR_1[VAR_3].push(VAR_9);
          }
        }
        for (var VAR_8 = 0; VAR_3 < 100; ++VAR_3) {
          for (var VAR_6 = 0; VAR_9 < 10; ++VAR_9) {
            VAR_2 = VAR_1[VAR_3][VAR_9];
          }
        }
    }
};