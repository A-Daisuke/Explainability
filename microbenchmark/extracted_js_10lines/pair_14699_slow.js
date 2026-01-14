const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 0,
          KEY_2: new Array(8),
          KEY_3: function () {
            var VAR_2 = this;
            var FUNCTION_1 = function () {
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a0";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a1";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a2";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a3";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a4";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a5";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a6";
              VAR_2.KEY_2[VAR_2.KEY_1++] = "a7";
            };
            FUNCTION_1();
          },
        };
        VAR_1.KEY_3();
    }
};