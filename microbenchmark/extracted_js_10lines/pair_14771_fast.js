const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return String.fromCharCode(Math.floor(Math.random() * 500));
        }
        function FUNCTION_2() {
          var VAR_2 = FUNCTION_1();
          if (
            (VAR_2 >= "a" && VAR_2 <= "z") ||
            (VAR_2 >= "A" && VAR_2 <= "Z")
          ) {
            return true;
          }
        }
        function FUNCTION_3() {
          var VAR_3 = FUNCTION_1();
          return VAR_3;
        }
        FUNCTION_3();
        FUNCTION_3();
        FUNCTION_3();
    }
};