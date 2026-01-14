const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return true;
        }
        function FUNCTION_2() {
          return FUNCTION_1();
        }
        function FUNCTION_3() {
          return FUNCTION_2();
        }
        function FUNCTION_4() {
          return FUNCTION_3();
        }
        function FUNCTION_5() {
          return FUNCTION_4();
        }
        FUNCTION_2();
    }
};