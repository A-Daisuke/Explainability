const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        var FUNCTION_2 = function () {
          FUNCTION_1.apply(this, arguments);
        };
        var FUNCTION_3 = function () {
          FUNCTION_1();
        };
        var FUNCTION_4 = function (VAR_1, VAR_2, VAR_3, VAR_4, VAR_5, VAR_6, VAR_7, VAR_8) {};
        var FUNCTION_5 = function () {
          FUNCTION_4.apply(this, arguments);
        };
        var FUNCTION_6 = function (VAR_9, VAR_10, VAR_11, VAR_12, VAR_13, VAR_14, VAR_15, VAR_16) {
          FUNCTION_4(VAR_1, VAR_2, VAR_3, VAR_4, VAR_5, VAR_6, VAR_7, VAR_8);
        };
        FUNCTION_2();
    }
};