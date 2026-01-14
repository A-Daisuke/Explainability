const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          this.VAR_1 += 1;
        };
        var VAR_2 = { KEY_1: 0 };
        var FUNCTION_2 = function () {
          FUNCTION_1.apply(VAR_2, arguments);
        };
        var FUNCTION_3 = function () {
          FUNCTION_1.apply(VAR_2);
        };
        var FUNCTION_4 = function () {
          FUNCTION_1.apply(VAR_2, []);
        };
        var FUNCTION_5 = function () {
          FUNCTION_1.apply(VAR_2, null);
        };
        var FUNCTION_6 = function () {
          FUNCTION_1.apply(VAR_2, undefined);
        };
        FUNCTION_2();
    }
};