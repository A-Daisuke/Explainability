const Benchmark = {
    run: function() {
        VAR_1 = Array.prototype;
        var FUNCTION_2 = function () {
            var VAR_2 = [],
              VAR_3 = 1,
              VAR_4 = arguments.length;
            for (; VAR_3 < VAR_4; VAR_3++) VAR_2.push(arguments[VAR_3]);
            return VAR_2;
          },
          FUNCTION_3 = function () {
            var VAR_5 = 0,
              VAR_6 = arguments.length - 1,
              VAR_7;
            for (; VAR_3 < VAR_6; VAR_3++) arguments[VAR_8] = arguments[VAR_3 + 1];
            return arguments;
          };
        var VAR_10 = 0;
        var VAR_11 = 0 !== 0;
    }
};