const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          return VAR_1 + 1;
        };
        var VAR_4 = (function () {
          return { KEY_1: FUNCTION_1 };
        })();
        var VAR_5 = (function () {
          return {
            KEY_2: 0,
            KEY_3: function (VAR_6) {
              this.KEY_2++;
            },
          };
        })();
        var VAR_7 = (function () {
          var VAR_8 = 0;
          return {
            KEY_4: function (VAR_9) {
              VAR_1++;
            },
          };
        })();
        var VAR_3 = 0;
        for (var VAR_10 = 0; VAR_10 < 100000; ++VAR_10) {
          VAR_3 = FUNCTION_1(VAR_3);
        }
    }
};