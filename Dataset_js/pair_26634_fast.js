const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
          KEY_4: 4,
        };
        var VAR_2 = {
          KEY_5: 2,
          KEY_6: 2,
          KEY_7: 3,
          KEY_8: 4,
        };
        var VAR_3 = 0;
        if (VAR_1 !== VAR_2) {
          VAR_3++;
        }
    }
};