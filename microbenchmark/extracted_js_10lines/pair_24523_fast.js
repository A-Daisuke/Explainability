const Benchmark = {
    run: function() {
        VAR_1 = 1;
        VAR_2 = 0;
        VAR_3 = {
          KEY_1: {
            KEY_2: 0,
            KEY_3: 1,
          },
        };
        if (VAR_1 == 1) {
          var VAR_4 = VAR_3.KEY_1;
          if (VAR_4.KEY_2 == 0) VAR_2++;
          if (VAR_4.KEY_3 == 1) VAR_2++;
        }
    }
};