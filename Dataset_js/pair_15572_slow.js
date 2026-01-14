const Benchmark = {
    run: function() {
        VAR_1 = 0;
        VAR_2 = -1;
        var VAR_3 = {
          1: function () {
            VAR_4 = 1;
          },
          2: function () {
            VAR_5 = 2;
          },
          3: function () {
            VAR_6 = 3;
          },
        };
        var VAR_7 = VAR_3[VAR_2];
        if (VAR_7) VAR_7();
        else VAR_8 = 4;
    }
};