const Benchmark = {
    run: function() {
        var VAR_1 = 1;
        var VAR_2;
        var VAR_3 = {};
        var VAR_4 = VAR_3;
        for (var VAR_5 = 0; VAR_5 < 8; VAR_5++) {
          VAR_4.VAR_6 = VAR_1;
          VAR_4.VAR_7 = {};
          VAR_4 = VAR_4.VAR_7;
        }
        VAR_2 = VAR_1;
    }
};