const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return VAR_1 + 1;
        }
        function FUNCTION_2() {
          var VAR_2 = 0;
          return VAR_2 + 1;
        }
        function FUNCTION_3() {
          var VAR_3 = FUNCTION_2();
          return VAR_3 - 0;
        }
        function FUNCTION_4() {
          var VAR_4 = FUNCTION_3();
          return VAR_4 - 0;
        }
        function FUNCTION_5() {
          var VAR_5 = FUNCTION_4();
          return VAR_5 - 0;
        }
        function FUNCTION_6() {}
        FUNCTION_5();
    }
};