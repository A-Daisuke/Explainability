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
        var VAR_5 = {
          KEY_4: 10,
          KEY_5: 100,
          KEY_6: 2,
        };
        var VAR_6 = VAR_5.KEY_1 * VAR_5.KEY_2 * VAR_5.KEY_3;
        var VAR_7 = {
          KEY_7: VAR_5.KEY_1,
          KEY_8: VAR_5.KEY_2,
          KEY_9: VAR_5.KEY_3,
          KEY_10: VAR_6,
        };
    }
};