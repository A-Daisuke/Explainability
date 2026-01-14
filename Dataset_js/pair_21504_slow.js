const Benchmark = {
    run: function() {
        var VAR_1 = 1,
          VAR_2 = 2;
        var VAR_3 = "a",
          VAR_4 = "b",
          VAR_5 = null;
        var VAR_6 = null;
        var VAR_7 = [1, "a", null];
        var VAR_8 = [1, "a", null];
        var VAR_9 = { KEY_1: "a" };
        var VAR_10 = 0;
        var VAR_11 = true,
          VAR_12 = true,
          VAR_13 = true;
        var VAR_14 = null;
        VAR_14 = VAR_8[1];
        VAR_13 = VAR_13 === (VAR_8[0] == VAR_2);
    }
};