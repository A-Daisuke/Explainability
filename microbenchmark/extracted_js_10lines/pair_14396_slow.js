const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          if (VAR_1 < 2) {
            return false;
          } else if (VAR_1 === 2) {
            return true;
          } else {
            VAR_1 = VAR_1 / 2;
            return FUNCTION_1(VAR_1);
          }
        };
        FUNCTION_1(32768);
    }
};