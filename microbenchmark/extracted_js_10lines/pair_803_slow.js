const Benchmark = {
    run: function() {
        var VAR_1 = {},
          VAR_2 = {},
          VAR_3 = {},
          VAR_4;
        for (VAR_4 = 0; VAR_4 < 10000; VAR_4++) {
          VAR_1["abc_" + VAR_4] = null;
        }
        for (VAR_4 = 0; VAR_4 < 10; VAR_4++) {
          VAR_2["abc_" + VAR_4] = null;
        }
        JSON.stringify(VAR_1) === "{}";
    }
};