const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          var VAR_3 = [];
          if (VAR_1 < VAR_2) {
            for (var VAR_4 = VAR_1; VAR_4 <= VAR_2; ++VAR_4) {
              VAR_3.push(VAR_4);
            }
          } else if (VAR_1 > VAR_2) {
            for (var VAR_5 = VAR_1; VAR_4 >= VAR_2; --VAR_4) {
              VAR_3.push(VAR_4);
            }
          } else return [VAR_1];
          return VAR_3;
        };
        FUNCTION_1(50, 1);
    }
};