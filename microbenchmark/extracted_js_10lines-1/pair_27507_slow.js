const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          return this;
        };
        var VAR_1 = {};
        VAR_1.VAR_2 = FUNCTION_1;
        VAR_1.__proto__.VAR_3 = FUNCTION_1;
        var VAR_4 = FUNCTION_1.bind(VAR_1);
        var FUNCTION_2 = function () {
          return FUNCTION_1.call(VAR_1);
        };
        var FUNCTION_3 = function () {
          return FUNCTION_1.apply(VAR_1, arguments);
        };
        VAR_1.FUNCTION_4 = function () {
          return FUNCTION_1.call(VAR_1);
        };
        VAR_1.FUNCTION_5 = function () {
          return FUNCTION_1.apply(VAR_1, arguments);
        };
        FUNCTION_3();
    }
};