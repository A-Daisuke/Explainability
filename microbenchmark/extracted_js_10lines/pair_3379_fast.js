const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
          VAR_1.push({
            KEY_1: "a",
            KEY_2: 2,
            KEY_3: true,
          });
        }
        for (var VAR_5 = 0; VAR_2 < VAR_1.length; VAR_2++) {
          var VAR_4 = VAR_1[VAR_2];
        }
    }
};