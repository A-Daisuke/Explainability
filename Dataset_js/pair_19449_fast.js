const Benchmark = {
    run: function() {
        var VAR_1 = 10,
          VAR_2 = 0.4,
          VAR_3 = true,
          VAR_4 = {},
          VAR_5 = "mys";
        function FUNCTION_1(VAR_6) {
          switch (typeof VAR_6) {
            case "boolean":
              return "b";
            case "number":
              return "0";
            case "string":
              return "s";
            case "object":
              return "o";
          }
          return "default";
        }
        FUNCTION_1(VAR_1);
        FUNCTION_1(VAR_2);
        FUNCTION_1(VAR_3);
        FUNCTION_1(VAR_4);
        FUNCTION_1(VAR_5);
    }
};