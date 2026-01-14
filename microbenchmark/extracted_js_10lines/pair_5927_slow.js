const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        var VAR_1 = (FUNCTION_1.prototype.KEY_1 = function () {});
        var VAR_2 = (FUNCTION_1.prototype.KEY_2 = function () {});
        var FUNCTION_2 = function () {
          return {
            KEY_1: VAR_1,
            KEY_2: VAR_2,
          };
        };
        var FUNCTION_3 = function () {
          var FUNCTION_4 = function () {};
          FUNCTION_4.KEY_1 = VAR_1;
          FUNCTION_4.KEY_2 = VAR_2;
          return FUNCTION_4;
        };
        var VAR_3 = new FUNCTION_3();
        var FUNCTION_5 = function () {
          return [VAR_1, VAR_2];
        };
        var VAR_4 = new VAR_3();
    }
};