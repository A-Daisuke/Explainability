const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {},
          VAR_1 = {},
          VAR_2 = "",
          VAR_3 = 1,
          VAR_4 = true,
          VAR_5 = Symbol("foo"),
          VAR_6 = NaN;
        function FUNCTION_2(VAR_7) {
          var VAR_8 = typeof VAR_7;
          switch (VAR_8) {
            case "object":
              if (VAR_7 === null) {
                return "null";
              }
            case "function":
              break;
            case "number":
              if (VAR_7 != +VAR_7) {
                return "NaN";
              }
            default:
              return VAR_8;
          }
          return "test";
        }
        FUNCTION_2(VAR_5);
    }
};