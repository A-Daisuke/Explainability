const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return /[a-z]/.test(VAR_1);
        }
        function FUNCTION_2(VAR_2) {
          return /[a-z]/i.test(VAR_2);
        }
        function FUNCTION_3(VAR_3) {
          return /[a-zA-Z]/.test(VAR_3);
        }
        function FUNCTION_4(VAR_4) {
          return ("a" <= VAR_4 && VAR_4 <= "z") || ("A" <= VAR_4 && VAR_4 <= "Z");
        }
        FUNCTION_2("a");
        FUNCTION_2("d");
        FUNCTION_2("9");
        FUNCTION_2("m");
        FUNCTION_2(":");
        FUNCTION_2("Z");
    }
};