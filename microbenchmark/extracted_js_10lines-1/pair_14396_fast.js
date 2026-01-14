const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          var VAR_2 = 1;
          if (VAR_1 === 1) {
            return false;
          }
          while (VAR_2 <= VAR_1) {
            if (VAR_2 === VAR_1) {
              return true;
            }
            VAR_2 *= 2;
          }
          return false;
        };
        FUNCTION_1(32768);
    }
};