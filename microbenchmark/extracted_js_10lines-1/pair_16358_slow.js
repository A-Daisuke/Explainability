const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          return VAR_2.slice(VAR_1);
        }
        VAR_3 = FUNCTION_1.bind(null, 1);
        function FUNCTION_2(VAR_4) {
          return FUNCTION_1(1, VAR_4);
        }
        function FUNCTION_3(VAR_5) {
          return function (VAR_6) {
            return FUNCTION_1(VAR_5, VAR_6);
          };
        }
        VAR_7 = FUNCTION_3(1);
        FUNCTION_3(1)("test");
    }
};