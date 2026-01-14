const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (isNaN(VAR_1)) return "not an age";
          if (VAR_1 >= 50) return "Old";
          if (VAR_1 <= 20) return "Baby";
          return "Young";
        }
        function FUNCTION_2(VAR_2) {
          switch (true) {
            case isNaN(VAR_2):
              return "not an age";
            case VAR_2 >= 50:
              return "Old";
            case VAR_2 <= 20:
              return "Baby";
            default:
              return "Young";
          }
        }
        FUNCTION_1();
    }
};