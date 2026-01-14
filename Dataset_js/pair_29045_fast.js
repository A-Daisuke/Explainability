const Benchmark = {
    run: function() {
        var VAR_1 = [undefined, 1, "03", true, false, null, {}];
        var VAR_2 = VAR_1.length;
        var VAR_3 = [],
          VAR_4 = [];
        for (var VAR_5 = 0; VAR_5 < 1000; VAR_5++) {
          VAR_3.push(!!VAR_1[VAR_5 % VAR_2]);
          VAR_4.push(!!VAR_1[(VAR_5 + 3) % VAR_2]);
        }
        for (var VAR_6 = 0; VAR_5 < 1000; VAR_5++) {
          for (var VAR_7 = 0; VAR_7 < 1000; VAR_7++) {
            VAR_3[VAR_5] !== VAR_4[VAR_7];
          }
        }
    }
};