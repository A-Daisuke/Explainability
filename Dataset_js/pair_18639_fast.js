const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          switch (VAR_1) {
            case 0:
              return "zero";
            case 1:
              return "one";
            case 2:
              return "two";
            case 3:
              return "three";
            case 4:
              return "four";
            case 5:
              return "five";
          }
        }
        FUNCTION_1(2) + FUNCTION_1(4);
    }
};