const Benchmark = {
    run: function() {
        VAR_1 = 9999;
        var VAR_2 = 0;
        var VAR_3 = VAR_1 % 7;
        while (VAR_3--) {
          VAR_2++;
        }
        VAR_3 = parseInt(VAR_1 / 7);
        while (VAR_3--) {
          VAR_2++;
          VAR_2++;
          VAR_2++;
          VAR_2++;
          VAR_2++;
          VAR_2++;
          VAR_2++;
        }
    }
};