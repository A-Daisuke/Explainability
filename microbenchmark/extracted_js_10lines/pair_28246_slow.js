const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2;
        for (var VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1.push([]);
        }
        var VAR_4;
        for (var VAR_5 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1[VAR_3].push({
            KEY_1: 0,
            KEY_2: null,
          });
          for (var VAR_6 = 1; VAR_6 < 10; ++VAR_6) {
            VAR_1[VAR_3].unshift({
              KEY_3: VAR_6,
              KEY_4: VAR_1[VAR_3][0],
            });
          }
        }
        var VAR_7;
        for (var VAR_8 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_7 = VAR_1[VAR_3][0];
          do {
            VAR_2 = VAR_7;
          } while ((VAR_7 = VAR_7.KEY_2) != null);
        }
    }
};