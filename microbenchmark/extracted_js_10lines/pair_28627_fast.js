const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = "f";
          function FUNCTION_2() {
            if (arguments[0]) {
              return (VAR_1 += arguments[0]);
            } else {
              VAR_1 += "o";
              return FUNCTION_2;
            }
          }
          return FUNCTION_2(arguments[0]);
        }
        FUNCTION_1()()()()()("l");
    }
};