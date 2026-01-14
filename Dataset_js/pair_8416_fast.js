const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        FUNCTION_1.VAR_1 = {
          KEY_1: FUNCTION_1,
          KEY_2: 1,
          KEY_3: true,
          KEY_4: "a",
        };
        var VAR_2;
        var VAR_3 = new FUNCTION_1();
        if (VAR_3 instanceof FUNCTION_1) {
          VAR_2 = true;
        }
    }
};