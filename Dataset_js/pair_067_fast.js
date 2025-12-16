const Benchmark = {
    run: function() {
    VAR_1 = {
      KEY_1: {
        KEY_2: 3,
        KEY_3: 4,
      },
    };
    VAR_2 = VAR_1.KEY_1;
    var VAR_3 = 0,
      VAR_4 = 0,
      VAR_5 = 0,
      VAR_6 = 0;
    var VAR_7 = VAR_1.KEY_1;
    VAR_4 += VAR_7.KEY_2 + VAR_7.KEY_3;
    VAR_3 += VAR_7.KEY_2 + VAR_7.KEY_3;
    VAR_5 += VAR_7.KEY_2 + VAR_7.KEY_3;
    VAR_6 += VAR_7.KEY_2 + VAR_7.KEY_3;
    }
};
