const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_9, VAR_10, VAR_11) {
          var VAR_12 = {
            KEY_5: VAR_9,
            KEY_6: VAR_10,
            KEY_7: VAR_11,
          };
          VAR_12.FUNCTION_2 = function () {};
          VAR_12.FUNCTION_3 = function () {};
          VAR_12.FUNCTION_4 = function () {};
          return VAR_12;
        }
        var VAR_13 = FUNCTION_1(777, "str", {});
    }
};