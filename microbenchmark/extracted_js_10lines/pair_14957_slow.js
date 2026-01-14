const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          return this.toISOString().slice(0, 10);
        };
        var FUNCTION_2 = function () {
          "use strict";
          function FUNCTION_3(VAR_1) {
            return VAR_1 < 10 ? "0" + VAR_1 : VAR_1;
          }
          var VAR_2 = this.getUTCFullYear(),
            VAR_3 = this.getUTCMonth() + 1,
            VAR_4 = this.getUTCDate();
          return VAR_2 + "-" + FUNCTION_3(VAR_3) + "-" + FUNCTION_3(VAR_4);
        };
        var VAR_5 = new Date();
        FUNCTION_1.call(VAR_5);
    }
};