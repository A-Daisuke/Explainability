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
        function FUNCTION_2(VAR_2) {
          switch (VAR_2) {
            case "a":
              return "zero";
            case "b":
              return "one";
            case "c":
              return "two";
            case "d":
              return "three";
            case "f":
              return "four";
            case "g":
              return "five";
          }
        }
        FUNCTION_2("b") + FUNCTION_1("d");
    }
};