const Benchmark = {
    run: function() {
        VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
          var VAR_3 = (Math.random() * 1000000) | 0;
          VAR_1.push(VAR_3);
        }
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_2 < 10; VAR_2++) {
          if (VAR_4.indexOf(VAR_1[VAR_2]) === -1) {
            VAR_4.push(VAR_1[VAR_2]);
          }
        }
    }
};