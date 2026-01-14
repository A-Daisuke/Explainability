const Benchmark = {
    run: function() {
        VAR_1 = {};
        VAR_1.FUNCTION_1 = function () {
          var VAR_2 = 1 + 1;
        };
        var FUNCTION_3 = function (VAR_8) {
          for (var VAR_9 = 0, VAR_10, VAR_11; (VAR_10 = VAR_1[VAR_8[VAR_9]]); VAR_9++) {
            VAR_10();
          }
        };
        VAR_1.FUNCTION_1();
    }
};