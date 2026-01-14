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
        var FUNCTION_2 = function () {};
        FUNCTION_2.VAR_3 = {
          KEY_3: FUNCTION_2,
          KEY_4: function () {},
        };
        var VAR_4 = new FUNCTION_2();
    }
};