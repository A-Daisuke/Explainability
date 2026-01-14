const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return function recurse(VAR_2) {
            if (VAR_2 === 1) return true;
            if (VAR_2 % VAR_1 === 0) {
              var VAR_3 = VAR_2 / VAR_1;
              return recurse(VAR_3);
            } else {
              return false;
            }
          };
        }
        var VAR_4 = FUNCTION_1(3);
        VAR_4(2541865828329);
    }
};