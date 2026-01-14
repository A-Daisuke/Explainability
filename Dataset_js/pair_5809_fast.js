const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [];
        var VAR_3 = [];
        for (var VAR_4 = 0; VAR_4 < 1000; ++VAR_4) {
          VAR_1.push(VAR_4);
        }
        for (var VAR_5 = 0; VAR_4 < 10000; ++VAR_4) {
          VAR_2.push(VAR_4);
        }
        for (var VAR_6 = 0; VAR_4 < 20000; ++VAR_4) {
          VAR_3.push(VAR_4);
        }
        var VAR_7 = VAR_2.slice();
        VAR_7.VAR_10 = 0;
    }
};