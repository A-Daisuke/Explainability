const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: true,
          KEY_2: true,
        };
        var VAR_2 = ["a", "ab", "abc", "d", "de", "def", "x", "xy", "xyz"];
        var VAR_3 = 0;
        VAR_3 = 0;
        for (var VAR_4 = 0, VAR_5 = VAR_2.length; VAR_4 < VAR_5; ++VAR_4) {
          var VAR_6 = VAR_2[VAR_4];
          if (VAR_1[VAR_6]) {
            ++VAR_3;
          }
        }
    }
};