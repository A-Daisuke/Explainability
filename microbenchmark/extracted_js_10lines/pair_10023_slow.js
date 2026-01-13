const Benchmark = {
    run: function() {
        var VAR_1 = {},
          VAR_2 = 0,
          VAR_3 = 100;
        (function () {
          var FUNCTION_1 = function (VAR_4) {
            this.VAR_5 = VAR_4;
          };
          for (; VAR_2 < VAR_3; ++VAR_2) {
            FUNCTION_1.call(VAR_1, "test");
          }
        })();
    }
};