const Benchmark = {
    run: function() {
        var VAR_1 = [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ];
        var VAR_2 = [];
        var VAR_3 = VAR_1.length;
        var VAR_4 = VAR_1[0].length;
        var VAR_5;
        var VAR_6;
        for (VAR_5 = 0; VAR_5 < VAR_4; VAR_5++) {
          VAR_2.push([]);
        }
        for (VAR_5 = 0; VAR_5 < VAR_3; VAR_5++) {
          for (VAR_6 = 0; VAR_6 < VAR_4; VAR_6++) {
            VAR_2[VAR_6].push(VAR_1[VAR_5][VAR_6]);
          }
        }
    }
};