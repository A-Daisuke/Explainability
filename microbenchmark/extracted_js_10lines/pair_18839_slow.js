const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return function (VAR_2) {
            return function (VAR_3) {
              return VAR_1 + VAR_2 + VAR_3;
            };
          };
        }
        function FUNCTION_2(VAR_4, VAR_5, VAR_6) {
          return VAR_4 + VAR_5 + VAR_6;
        }
        function FUNCTION_3(VAR_7, VAR_8) {
          return function (VAR_9) {
            return FUNCTION_2(VAR_7, VAR_8, VAR_9);
          };
        }
        function FUNCTION_4(VAR_10) {
          return function (VAR_11) {
            return FUNCTION_3(VAR_10, VAR_11);
          };
        }
        FUNCTION_1(1)(2)(3);
    }
};