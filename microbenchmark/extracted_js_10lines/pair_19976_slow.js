const Benchmark = {
    run: function() {
        var VAR_1 = [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ];
        var VAR_2 = 0,
          VAR_3,
          VAR_4;
        for (var VAR_5 = 0, VAR_6 = VAR_1.length; VAR_5 < VAR_6; ++VAR_5) {
          VAR_4 = VAR_1[VAR_5];
          VAR_3 = Number(VAR_4);
          if (!isNaN(VAR_3) && (!VAR_4.trim || VAR_4.trim())) {
            VAR_2 += VAR_3;
          }
        }
    }
};