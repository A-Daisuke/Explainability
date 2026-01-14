const Benchmark = {
    run: function() {
        var VAR_1 = 1000;
        var VAR_2 = [];
        for (var VAR_3 = 0; VAR_3 < VAR_1; ++VAR_3) {
          var VAR_4 = new Array(VAR_1);
          VAR_4.fill(10);
          VAR_2.push(VAR_4);
        }
        var VAR_5 = [];
        for (var VAR_6 = 0; VAR_3 < VAR_1; ++VAR_3) {
          var VAR_7 = new Uint32Array(VAR_1);
          VAR_4.fill(10);
          VAR_5.push(VAR_4);
        }
        var VAR_8 = 0;
        for (var VAR_9 = 0; VAR_3 < VAR_1; VAR_3++)
          for (var VAR_10 = 0; VAR_10 < VAR_1; VAR_10++) {
            VAR_8 += VAR_2[VAR_10][VAR_3];
          }
    }
};