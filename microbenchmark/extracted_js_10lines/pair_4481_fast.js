const Benchmark = {
    run: function() {
        var VAR_1 = {};
        for (var VAR_2 = 0; VAR_2 < 100000; VAR_2++) {
          var VAR_3 = !!VAR_1.VAR_3;
        }
        VAR_1.VAR_4 = true;
        for (var VAR_5 = 0; VAR_2 < 100000; VAR_2++) {
          var VAR_6 = !!VAR_1.VAR_3;
        }
        VAR_1.VAR_7 = undefined;
        for (var VAR_8 = 0; VAR_2 < 100000; VAR_2++) {
          var VAR_9 = !!VAR_1.VAR_3;
        }
    }
};