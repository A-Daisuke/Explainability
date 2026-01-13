const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [];
        var VAR_3 = [];
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_5 < 10000; VAR_5++) {
          VAR_1.push(VAR_5);
          VAR_2.push(VAR_5);
          VAR_3.push({
            KEY_1: VAR_5,
            KEY_2: VAR_5,
          });
          VAR_4.push([VAR_5, VAR_5]);
        }
        for (var VAR_6 = 0, VAR_7 = VAR_1.length; VAR_5 < VAR_7; VAR_5++) {
          var VAR_8 = VAR_1[VAR_5] + VAR_2[VAR_5];
        }
    }
};