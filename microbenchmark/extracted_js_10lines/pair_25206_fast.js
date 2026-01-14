const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {},
          VAR_1 = {},
          VAR_2 = "",
          VAR_3 = 1,
          VAR_4 = true,
          VAR_6 = NaN,
          VAR_5 = null;
        function FUNCTION_2(VAR_7) {
          var VAR_8 = typeof VAR_7;
          if (VAR_8 === "object") {
            if (VAR_7 === null) {
              return "null";
            }
          } else if (VAR_8 !== "function") {
            if (VAR_8 === "number" && VAR_7 != +VAR_7) {
              return "NaN";
            }
            return VAR_8;
          }
          return "test";
        }
        FUNCTION_2(VAR_5);
    }
};