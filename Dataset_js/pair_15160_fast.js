const Benchmark = {
    run: function() {
        var VAR_1 = "mlhvcsqtaz";
        function FUNCTION_1(VAR_2) {
          return VAR_2.length == 1 && VAR_1.indexOf(VAR_2) != -1;
        }
        function FUNCTION_2(VAR_3) {
          switch (VAR_3) {
            case "m":
            case "l":
            case "h":
            case "v":
            case "c":
            case "s":
            case "q":
            case "t":
            case "a":
            case "z":
              return true;
              break;
          }
          return false;
        }
        FUNCTION_2("#");
    }
};