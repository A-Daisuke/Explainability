const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = 1,
            VAR_3 = 2,
            VAR_4 = FUNCTION_1 + VAR_3;
        }
        var VAR_5 = (function () {
          var VAR_6, VAR_7, VAR_8, VAR_9;
          return function (VAR_10) {
            FUNCTION_1 = 1;
            VAR_5 = 2;
            VAR_8 = FUNCTION_1 + VAR_5;
          };
        })();
        var VAR_12 = (function () {
          var VAR_13 = Object.prototype.toString;
          return function (VAR_14) {
            return VAR_13.call(VAR_14) === "[object Array]";
          };
        })();
        VAR_12([1, 2, 3]);
    }
};