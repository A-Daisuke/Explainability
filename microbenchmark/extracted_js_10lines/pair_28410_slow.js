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
        function FUNCTION_2(VAR_11) {
          return Object.prototype.toString.call(VAR_11) === "[object Array]";
        }
        FUNCTION_2([1, 2, 3]);
    }
};