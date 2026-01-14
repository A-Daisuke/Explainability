const Benchmark = {
    run: function() {
        var VAR_1 =
          "Lets find l as many times as we can. Love is natural, love you lots";
        var FUNCTION_1 = function (VAR_2) {
          var VAR_4 = 0,
            VAR_5 = 0;
          do {
            VAR_4 = VAR_2.indexOf("l", VAR_4);
          } while (++VAR_4 && ++VAR_5);
          return VAR_5;
        };
        FUNCTION_1(VAR_1);
    }
};