const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = [],
          VAR_3 = 100000,
          VAR_4,
          VAR_5,
          VAR_6;
        for (var VAR_7 = 0; VAR_4 < 10000; VAR_4++) {
          VAR_1.push(VAR_4 * 2);
        }
        VAR_5 = 0;
        while (VAR_1.length > 0 && VAR_5 < VAR_3) {
          VAR_6 = VAR_1.shift();
          VAR_2.push(VAR_6);
          VAR_5 += VAR_6;
        }
    }
};