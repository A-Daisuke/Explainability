const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_2, VAR_3, VAR_4) {
          VAR_2[VAR_5] = VAR_4;
        };
        var VAR_6 = (function () {
          return {
            KEY_1: function (VAR_7, VAR_8) {
              this[VAR_5] = VAR_4;
            },
          };
        })();
        for (var VAR_9 = 0; VAR_9 < 2500; VAR_9++) {}
    }
};