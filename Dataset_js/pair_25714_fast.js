const Benchmark = {
    run: function() {
        var VAR_1 = 0.1;
        function FUNCTION_1(VAR_2) {
          if (VAR_2 > VAR_1) return VAR_2;
          throw "bad one";
        }
        function FUNCTION_2(VAR_3) {
          if (VAR_3 > VAR_1)
            return {
              KEY_1: VAR_3,
              KEY_2: VAR_3 + 2,
            };
          return {
            KEY_3: VAR_3,
            KEY_4: VAR_3 + 1,
          };
        }
        function FUNCTION_3(VAR_4) {
          if (VAR_4 > VAR_1) {
            return 1 - VAR_4;
          } else {
            return VAR_4;
          }
        }
        FUNCTION_3(Math.random());
    }
};