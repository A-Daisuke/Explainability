const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return 2 * VAR_1;
        }
        function FUNCTION_2(VAR_2) {
          this(2 * VAR_2);
        }
        function FUNCTION_3(VAR_3) {
          this(FUNCTION_1(VAR_3));
        }
        var VAR_4 = FUNCTION_1(1);
    }
};