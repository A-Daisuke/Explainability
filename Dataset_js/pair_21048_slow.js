const Benchmark = {
    run: function() {
        var VAR_1;
        function FUNCTION_1() {
          VAR_1++;
        }
        function FUNCTION_2() {
          function FUNCTION_3() {
            FUNCTION_1();
            if (VAR_1 > 0) return;
            FUNCTION_1();
          }
          FUNCTION_1();
          FUNCTION_3();
          FUNCTION_1();
        }
        FUNCTION_2();
    }
};