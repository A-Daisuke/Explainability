const Benchmark = {
    run: function() {
        var VAR_1 = {},
          VAR_2 = {},
          VAR_4 = {},
          VAR_3;
        for (VAR_3 = 0; VAR_3 < 10000; VAR_3++) {
          VAR_1["abc_" + VAR_3] = null;
        }
        for (VAR_3 = 0; VAR_3 < 10; VAR_3++) {
          VAR_2["abc_" + VAR_3] = null;
        }
        var VAR_5;
        for (VAR_5 in VAR_4) {
          if (VAR_4.hasOwnProperty(VAR_5)) {
            break;
          }
        }
    }
};