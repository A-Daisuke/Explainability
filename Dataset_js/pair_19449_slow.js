const Benchmark = {
    run: function() {
        var VAR_1 = 10,
          VAR_2 = 0.4,
          VAR_3 = true,
          VAR_4 = {},
          VAR_5 = "mys";
        function FUNCTION_1(VAR_6) {
          switch (VAR_6.constructor) {
            case Boolean:
              return "b";
            case Number:
              return "0";
            case String:
              return "s";
            case Object:
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