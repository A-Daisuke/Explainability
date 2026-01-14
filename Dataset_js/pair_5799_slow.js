const Benchmark = {
    run: function() {
        var VAR_1 = 1000;
        var VAR_2 = [],
          VAR_3 = [];
        for (var VAR_4 = 0; VAR_4 < VAR_1; VAR_4++) {
          VAR_2.push(VAR_4.toString() + "." + VAR_4.toString());
          VAR_3.push(VAR_4.toString());
        }
        var VAR_5 = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
        var VAR_6 = [],
          VAR_7;
        for (var VAR_8 = 0; VAR_4 < VAR_1; VAR_4++) {
          VAR_7 = VAR_2[VAR_4];
          if (VAR_5.test(VAR_7)) VAR_6.push(+VAR_7);
        }
    }
};