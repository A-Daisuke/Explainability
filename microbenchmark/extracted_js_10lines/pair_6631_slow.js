const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return function () {
            return VAR_1;
          };
        }
        function FUNCTION_2(VAR_2) {
          return { KEY_1: VAR_2 };
        }
        function FUNCTION_3(VAR_3) {
          this.KEY_1 = VAR_3;
        }
        function FUNCTION_4(VAR_4) {
          return new FUNCTION_3(VAR_4);
        }
        FUNCTION_4();
    }
};