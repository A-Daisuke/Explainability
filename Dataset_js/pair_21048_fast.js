const Benchmark = {
    run: function() {
        var VAR_1;
        function FUNCTION_1() {
          VAR_1++;
        }
        function FUNCTION_3() {
          FUNCTION_1();
          label: {
            FUNCTION_1();
            if (VAR_1 > 0) break label;
            FUNCTION_1();
          }
          FUNCTION_1();
        }
        FUNCTION_3();
    }
};