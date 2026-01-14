const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 10,
          KEY_2: 100,
          KEY_3: 2,
        };
        var VAR_2 = 10,
          VAR_3 = 100,
          VAR_4 = 2;
        var VAR_8 = 10,
          VAR_9 = 100,
          VAR_10 = 2;
        var VAR_11 = {
          KEY_11: VAR_8,
          KEY_12: VAR_9,
          KEY_13: VAR_10,
        };
        VAR_11.VAR_12 = VAR_8 * VAR_9 * VAR_10;
    }
};