const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: true,
          KEY_2: true,
          KEY_3: true,
          KEY_4: true,
          KEY_5: true,
        };
        var VAR_2 = {
          KEY_6: 1,
          KEY_7: 1,
          KEY_8: 1,
          KEY_9: 1,
          KEY_10: 1,
        };
        !!VAR_2["xxx"];
    }
};