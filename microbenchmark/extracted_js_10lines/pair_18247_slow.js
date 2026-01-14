const Benchmark = {
    run: function() {
        VAR_1 = {};
        VAR_1.FUNCTION_1 = function () {
          var VAR_2 = 1 + 1;
        };
        var FUNCTION_2 = function (VAR_3) {
          for (var VAR_4 = 0, VAR_5, VAR_6; (VAR_5 = VAR_1[VAR_3[VAR_4]]); VAR_4++) {
            if (typeof VAR_5 !== "function") {
              return;
            }
            try {
              VAR_5();
            } catch (VAR_7) {
              $Y.report("Error in module: " + VAR_3[VAR_4], VAR_7);
            }
          }
        };
        var FUNCTION_3 = function (VAR_8) {
          for (var VAR_9 = 0, VAR_10, VAR_11; (VAR_5 = VAR_1[VAR_3[VAR_4]]); VAR_4++) {
            VAR_5();
          }
        };
        FUNCTION_2(["modulo"]);
    }
};