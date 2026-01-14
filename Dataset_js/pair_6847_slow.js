const Benchmark = {
    run: function() {
        var VAR_1 = Array(32);
        var VAR_2 = Array(32);
        var VAR_3;
        var VAR_4;
        var VAR_5;
        for (var VAR_6 = 0, VAR_7 = VAR_1.length; VAR_6 < VAR_7; VAR_6++) {
          VAR_3 = VAR_1[VAR_6];
          for (var VAR_8 = 0, VAR_9 = VAR_2.length; VAR_8 < VAR_9; VAR_8++) {
            VAR_4 = VAR_2[VAR_8];
            VAR_5 = VAR_6;
          }
        }
    }
};