const Benchmark = {
    run: function() {
        var VAR_1 = [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ];
        var VAR_7 = VAR_1[0].map(function (VAR_8, VAR_9) {
          return VAR_1.map(function (VAR_10) {
            return VAR_10[VAR_9];
          });
        });
    }
};