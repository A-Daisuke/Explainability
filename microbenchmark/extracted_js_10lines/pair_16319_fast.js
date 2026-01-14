const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
        };
        var VAR_2 = Object.freeze({
          KEY_4: 1,
          KEY_5: 2,
          KEY_6: 3,
        });
        var VAR_3;
        for (var VAR_5 in VAR_1) {
          VAR_3 = VAR_5;
        }
    }
};