const Benchmark = {
    run: function() {
        var FUNCTION_2 = function (VAR_7, VAR_8) {
          VAR_9 = VAR_7.length + VAR_8.length;
          VAR_10 = [];
          VAR_11 = 0;
          VAR_12 = 0;
          for (VAR_13 = 0; VAR_13 < VAR_9; VAR_13++) {
            if (VAR_7[VAR_11] < VAR_8[VAR_12]) {
              VAR_10.push(VAR_7[VAR_11]);
              VAR_11++;
            } else {
              VAR_10.push(VAR_8[VAR_12]);
              VAR_12++;
            }
          }
          return VAR_10;
        };
    }
};