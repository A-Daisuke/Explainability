const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          return Math.random() > 0.5;
        };
        var FUNCTION_2 = function (VAR_2) {
          var VAR_3 = "";
          for (var VAR_4 = 0; VAR_4 < 1000000; VAR_4++) {
            VAR_3 = VAR_2();
          }
        };
        FUNCTION_2(function () {
          return FUNCTION_1() ? "heads" : "tails";
        });
    }
};