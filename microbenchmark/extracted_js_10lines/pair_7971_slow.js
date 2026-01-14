const Benchmark = {
    run: function() {
        const VAR_1 = 3000 / 50;
        for (var VAR_2 = 0, VAR_3 = 0; VAR_2 < 3000; VAR_2++) {
          if (VAR_2 == VAR_3) {
            var VAR_4;
            VAR_4 = 1;
            VAR_3 += VAR_1;
          } else {
            var VAR_5;
            VAR_5 = 1;
          }
        }
    }
};