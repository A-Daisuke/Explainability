const Benchmark = {
    run: function() {
        var VAR_1 = {};
        VAR_1.VAR_2 = {};
        VAR_1.VAR_2.VAR_3 = {};
        VAR_1.VAR_2.VAR_3.FUNCTION_1 = function () {};
        VAR_1.VAR_2.VAR_3.FUNCTION_1.FUNCTION_2 = function (VAR_4, VAR_5) {
          return VAR_4 + VAR_5;
        };
        VAR_1.VAR_2.VAR_3.VAR_6 = {};
        VAR_1.VAR_2.VAR_3.VAR_6.VAR_7 = ["Red", 0];
        var FUNCTION_3 = function () {};
        var VAR_8 =
          (FUNCTION_3.FUNCTION_4 = function (VAR_9, VAR_10) {
            return VAR_4 + VAR_5;
          });
        var VAR_11 = {};
        var VAR_12 = ["Red", 0];
        var VAR_13 = VAR_12;
    }
};