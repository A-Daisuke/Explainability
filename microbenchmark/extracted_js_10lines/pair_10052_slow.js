const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = [],
          VAR_3 = 50,
          VAR_4 = 30,
          VAR_5 = 0;
        while (VAR_5 < VAR_3) {
          VAR_1.push(VAR_5);
          VAR_5++;
        }
        VAR_5 = 0;
        while (VAR_5 < VAR_4) {
          VAR_2.push(VAR_5);
          VAR_5++;
        }
        VAR_2.forEach(function (VAR_6) {
          VAR_1.push(VAR_6);
        });
    }
};