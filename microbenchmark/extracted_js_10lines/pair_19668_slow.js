const Benchmark = {
    run: function() {
        var VAR_1 = ["abc", "abc", "abc"];
        var VAR_2 = ["", "abc", "abc"];
        var VAR_3 = ["", "", "abc"];
        var VAR_4 = [undefined, "abc", "abc"];
        var VAR_5 = [undefined, undefined, "abc"];
        var FUNCTION_1 = function () {
          for (var VAR_6 = 0; VAR_6 < arguments.length; ++VAR_6) {
            if (arguments[VAR_6] !== undefined) {
              return arguments[VAR_6];
            }
          }
        };
        FUNCTION_1(VAR_2[0], VAR_2[1], VAR_2[2]);
    }
};