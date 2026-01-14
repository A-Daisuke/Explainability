const Benchmark = {
    run: function() {
        VAR_1 = {};
        for (var VAR_2 = 0; VAR_2 < 100; VAR_2++) {
          for (var VAR_3 = 0; VAR_3 < 100; VAR_3++) {
            VAR_1[VAR_2 + VAR_3 * 100] = 1;
          }
        }
        for (var VAR_4 = 0; VAR_2 < 100; VAR_2++) {
          for (var VAR_5 = 0; VAR_3 < 100; VAR_3++) {
            delete VAR_1[VAR_2 + VAR_3 * 100];
          }
        }
    }
};