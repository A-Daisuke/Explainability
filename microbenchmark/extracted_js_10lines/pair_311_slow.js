const Benchmark = {
    run: function() {
        VAR_1 = [];
        VAR_2 = [];
        VAR_3 = [];
        for (var VAR_4 = 0; VAR_4 < 1000; VAR_4++) {
          VAR_1.push(VAR_4);
        }
        for (var VAR_5 = 0; VAR_4 < 10000; VAR_4++) {
          VAR_2.push(VAR_4);
        }
        for (var VAR_6 = 0; VAR_4 < 100000; VAR_4++) {
          VAR_3.push(VAR_4);
        }
        for (var VAR_7 in VAR_3) {
        }
    }
};