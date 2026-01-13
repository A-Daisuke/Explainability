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
        for (var VAR_6 = 0, VAR_4 = VAR_2.length; VAR_3 < VAR_4; VAR_3++) {
          VAR_5 = {
            KEY_7: VAR_2[VAR_3].KEY_1,
            KEY_8: VAR_2[VAR_3].KEY_2,
          };
        }
    }
};