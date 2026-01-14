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
        function FUNCTION_4() {
          this(FUNCTION_1.apply(undefined, arguments));
        }
        var VAR_4;
        function FUNCTION_5(VAR_5) {
          VAR_4 = VAR_5;
        }
        FUNCTION_4.call(FUNCTION_5, 1);
    }
};