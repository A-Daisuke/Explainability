const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = [];
        for (var VAR_3 = 0; VAR_4 <= 1000; VAR_3++) {
          VAR_1.push([0, 1]);
          VAR_2.push({
            KEY_1: 0,
            KEY_2: 1,
          });
        }
        var VAR_5;
        for (var VAR_6 = 0, VAR_4 = VAR_1.length; VAR_3 < VAR_4; VAR_3++) {
          if (VAR_1[VAR_3].KEY_1 && VAR_1[VAR_3].KEY_2) {
            VAR_5 = {
              KEY_3: VAR_1[VAR_3].KEY_1,
              KEY_4: VAR_1[VAR_3].KEY_2,
            };
          } else if (VAR_1[VAR_3].length) {
            VAR_5 = {
              KEY_5: VAR_1[VAR_3][0],
              KEY_6: VAR_1[VAR_3][1],
            };
          }
        }
    }
};