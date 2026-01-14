const Benchmark = {
    run: function() {
        VAR_1 = {
          KEY_1: null,
          KEY_2: null,
          KEY_3: null,
          KEY_4: null,
          KEY_5: null,
        };
        VAR_1.KEY_1 = 17;
        VAR_1.KEY_2 = 98;
        VAR_1.KEY_3 = 47;
        VAR_1.KEY_4 = 4;
        VAR_1.KEY_5 = 36;
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