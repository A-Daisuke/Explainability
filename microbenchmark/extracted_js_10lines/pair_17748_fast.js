const Benchmark = {
    run: function() {
        var VAR_7 = {
          KEY_1: 1,
          KEY_2: 1,
          KEY_3: 1,
        };
        var VAR_2 = [1, 1, 1];
        var VAR_8 = VAR_7.KEY_1;
        var VAR_9 = VAR_7.KEY_2;
        var VAR_10 = VAR_7.KEY_3;
        VAR_7.KEY_1 = VAR_8;
        VAR_7.KEY_2 = VAR_9;
        VAR_7.KEY_3 = VAR_10;
        var VAR_11 = Math.sqrt(
          VAR_7.KEY_1 * VAR_7.KEY_1 + VAR_7.KEY_2 * VAR_7.KEY_2 + VAR_7.KEY_3 * VAR_7.KEY_3,
        );
        VAR_7.KEY_1 /= VAR_11;
        VAR_7.KEY_2 /= VAR_11;
        VAR_7.KEY_3 /= VAR_11;
    }
};