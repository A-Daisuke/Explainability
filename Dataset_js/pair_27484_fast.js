const Benchmark = {
    run: function() {
        VAR_1 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
          KEY_4: 4,
          KEY_5: 5,
          KEY_6: 6,
          KEY_7: 7,
        };
        VAR_2 = {
          KEY_8: 1,
          KEY_9: 3,
        };
        var VAR_3;
        for (VAR_3 in VAR_1) {
          if (VAR_3 in VAR_2) {
            VAR_2.VAR_4 = VAR_1.VAR_3;
          }
        }
    }
};