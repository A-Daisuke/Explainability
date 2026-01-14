const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          this.VAR_1 = {
            KEY_1: function () {},
          };
        };
        var VAR_2 = {
          KEY_2: function () {},
        };
        var FUNCTION_3 = function () {
          var VAR_5 = {};
          VAR_5.KEY_1 = function () {};
          return VAR_5;
        };
        var FUNCTION_2 = function () {};
        FUNCTION_2.VAR_3 = {
          KEY_3: FUNCTION_2,
          KEY_4: function () {},
        };
        var VAR_6 = FUNCTION_3();
    }
};