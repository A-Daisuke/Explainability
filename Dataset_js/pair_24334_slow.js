const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 1,
          KEY_2: 1,
          KEY_3: 1,
          KEY_4: 1,
          KEY_5: 1,
          KEY_6: 1,
          KEY_7: 1,
          KEY_8: 1,
          KEY_9: 1,
          KEY_10: 1,
        };
        if ("foo" in VAR_1 && VAR_1.KEY_10 > 0) {
          var VAR_2 = VAR_1.KEY_10;
        }
    }
};