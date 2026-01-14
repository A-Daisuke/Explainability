const Benchmark = {
    run: function() {
        var VAR_1 =
          "Lets find l as many times as we can. Love is natural, love you lots";
        var FUNCTION_1 = function (VAR_2, VAR_3) {
          var VAR_4 = 0,
            VAR_5 = VAR_2.indexOf(VAR_3);
          if (VAR_5 > -1) {
            VAR_4 += 1 + FUNCTION_1(VAR_2.slice(VAR_5 + 1, VAR_2.length - 1), VAR_3);
          }
          return VAR_4;
        };
        FUNCTION_1(VAR_1, "l");
    }
};