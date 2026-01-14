const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return function () {
            return VAR_1;
          };
        }
        function FUNCTION_5() {
          return function () {};
        }
        function FUNCTION_2(VAR_2) {
          return { KEY_1: VAR_2 };
        }
        FUNCTION_5();
    }
};