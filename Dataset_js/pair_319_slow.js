const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 100000; VAR_2++) {
          VAR_1.push({
            KEY_1: VAR_2,
            KEY_2: VAR_2 * 12,
          });
        }
        VAR_1.forEach(function (VAR_3) {
          delete VAR_3.KEY_2;
        });
    }
};