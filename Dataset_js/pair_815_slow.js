const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = {},
          VAR_3;
        for (var VAR_4 = 0; VAR_4 < 10000; VAR_4++) {
          VAR_1.push({
            KEY_1: VAR_4 + "srrr",
            KEY_2: Math.random(),
          });
          VAR_2[VAR_4 + "srrr"] = {
            KEY_3: VAR_4 + "srrr",
            KEY_4: Math.random(),
          };
        }
        for (var VAR_5 in VAR_2) {
          if (VAR_2[VAR_5]) {
            VAR_3 = VAR_2[VAR_5];
          }
        }
    }
};