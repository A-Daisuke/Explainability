const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_9 = 1;
          for (var VAR_10 = 0; VAR_10 < VAR_1; VAR_10++) {
            VAR_9 *= (VAR_1 - VAR_10) / (VAR_2 - VAR_10);
          }
          return VAR_9;
        }
        var VAR_3 = (function () {
          var FUNCTION_2 = function (VAR_4, VAR_5, VAR_6) {
            if (VAR_4 == 0) {
              return VAR_6;
            } else {
              return FUNCTION_2(VAR_4 - 1, VAR_5 - 1, (VAR_4 / VAR_5) * VAR_6);
            }
          };
          return function (VAR_7, VAR_8) {
            return FUNCTION_2(VAR_4, VAR_5, 1);
          };
        })();
        FUNCTION_1(20, 100);
    }
};