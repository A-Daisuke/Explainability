const Benchmark = {
    run: function() {
        var VAR_1 = 1000;
        var VAR_2 = [],
          VAR_3 = [];
        for (var VAR_4 = 0; VAR_4 < VAR_1; VAR_4++) {
          VAR_2.push(VAR_4.toString() + "." + VAR_4.toString());
          VAR_3.push(VAR_4.toString());
        }
        var VAR_6 = [],
          VAR_7;
        for (var VAR_8 = 0; VAR_4 < VAR_1; VAR_4++) {
          VAR_7 = +VAR_3[VAR_4];
          if (!isNaN(VAR_7)) VAR_6.push(VAR_7);
        }
    }
};