const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [];
        var VAR_3 = [];
        var VAR_4 = {};
        for (var VAR_5 = 0; VAR_5 < 1000000; VAR_5++) {
          if (VAR_5 < 100) {
            VAR_1.push(VAR_4);
          }
          if (VAR_5 < 10000) {
            VAR_2.push(VAR_4);
          }
          VAR_3.push(VAR_4);
        }
        VAR_3.concat(VAR_3);
    }
};