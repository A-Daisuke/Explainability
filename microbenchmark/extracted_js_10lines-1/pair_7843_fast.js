const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return function (VAR_2) {
            if (VAR_2 == 0) return false;
            while (VAR_2 % (VAR_1 * VAR_1) == 0) {
              VAR_2 /= VAR_1 * VAR_1;
            }
            return VAR_2 == 1 || VAR_2 == VAR_1;
          };
        }
        FUNCTION_1(3)(2541865828329);
    }
};