const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
            return this.KEY_1;
          },
          VAR_1 = {
            KEY_1: "value",
            KEY_2: FUNCTION_1,
          },
          VAR_2 = [0, 1, 2, 3],
          VAR_3 = FUNCTION_1.bind(VAR_1);
        FUNCTION_1.call(VAR_1, VAR_2[0], VAR_2[1], VAR_2[2], VAR_2[3]);
    }
};