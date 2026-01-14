const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          if (VAR_2 < 2) {
            return VAR_1.toString();
          }
          var VAR_3 = Math.pow(2, VAR_2 - 1);
          var VAR_4 = Math.pow(2, VAR_2);
          if (VAR_1 < VAR_3) {
            return "0" + FUNCTION_1(VAR_1, VAR_2 - 1);
          } else {
            return "1" + FUNCTION_1(VAR_4 - VAR_1 - 1, VAR_2 - 1);
          }
        };
        FUNCTION_1(2342323, 50);
    }
};