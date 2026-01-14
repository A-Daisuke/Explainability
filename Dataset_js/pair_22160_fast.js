const Benchmark = {
    run: function() {
        VAR_1 = {
          KEY_1: 17,
          KEY_2: 98,
          KEY_3: 47,
          KEY_4: 4,
          KEY_5: 36,
        };
        if (VAR_1.KEY_2 > VAR_1.KEY_5) {
          VAR_1.KEY_3 = 74;
        }
        if (VAR_1.KEY_1 <= VAR_1.KEY_3) {
          VAR_1.KEY_4 = 8;
        }
        if (VAR_1.KEY_5 < VAR_1.KEY_3) {
          VAR_1.KEY_1 = 35;
        }
    }
};