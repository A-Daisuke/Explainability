const Benchmark = {
    run: function() {
        var VAR_1;
        var VAR_2 = 500;
        while (VAR_2--) {
          VAR_1 += String.fromCharCode(32 + ((Math.random() * 95) | 0));
        }
        var FUNCTION_1 = function (VAR_3, VAR_4) {
          return VAR_3 + VAR_4;
        };
        var FUNCTION_2 = function (VAR_5) {
          return Array.prototype.reduceRight.call(VAR_1, FUNCTION_1, "");
        };
        var FUNCTION_3 = function (VAR_6) {
          return VAR_1.split("").reverse().join("");
        };
        FUNCTION_3(VAR_1);
    }
};