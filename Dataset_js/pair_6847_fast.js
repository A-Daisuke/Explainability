const Benchmark = {
    run: function() {
        var VAR_1 = Array(32);
        var VAR_2 = Array(32);
        var VAR_3;
        var VAR_4;
        var VAR_5;
        VAR_1.forEach(function (VAR_10, VAR_11) {
          VAR_3 = VAR_10;
          VAR_2.forEach(function (VAR_12, VAR_13) {
            VAR_4 = VAR_12;
            VAR_5 = VAR_11;
          });
        });
    }
};