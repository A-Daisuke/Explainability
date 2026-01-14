const Benchmark = {
    run: function() {
        function FUNCTION_2() {
          var VAR_2 = FUNCTION_2.toString().split("()")[0].replace("function ", "");
        }
        function FUNCTION_3() {
          var VAR_3 = FUNCTION_2.toString();
        }
        function FUNCTION_4() {
          var VAR_4 = "test";
        }
        new FUNCTION_2();
    }
};