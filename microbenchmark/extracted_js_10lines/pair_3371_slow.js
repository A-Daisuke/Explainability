const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2,
          VAR_3,
          VAR_4,
          VAR_5;
        for (VAR_4 = 0; VAR_4 < 1000; VAR_4++) {
          VAR_3 = [];
          for (VAR_5 = VAR_4; VAR_5 < VAR_4 + 10; VAR_5++) {
            VAR_3.push(VAR_5);
          }
          VAR_1.push(VAR_3);
        }
        VAR_2 = [];
        for (VAR_4 = 0; VAR_4 < VAR_1.length; VAR_4++) {
          Array.prototype.push.apply(VAR_2, VAR_1[VAR_4]);
        }
    }
};