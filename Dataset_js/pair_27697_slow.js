const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "exists",
          KEY_2: "yep, here too",
          KEY_3: "Howdy",
        };
        var FUNCTION_1 = function () {
          return 1 + 1;
        };
        if ("east" in VAR_1) {
          FUNCTION_1();
        }
        if ("west" in VAR_1) {
          FUNCTION_1();
        }
    }
};