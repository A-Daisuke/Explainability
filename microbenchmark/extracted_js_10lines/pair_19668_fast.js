const Benchmark = {
    run: function() {
        var VAR_1 = ["abc", "abc", "abc"];
        var VAR_2 = ["", "abc", "abc"];
        var VAR_3 = ["", "", "abc"];
        var VAR_4 = [undefined, "abc", "abc"];
        var VAR_5 = [undefined, undefined, "abc"];
        var FUNCTION_1 = function (VAR_7, VAR_8, VAR_9) {
          if (VAR_7 !== undefined) {
            return VAR_7;
          }
          if (VAR_8 !== undefined) {
            return VAR_8;
          }
          return VAR_9;
        };
        FUNCTION_1(VAR_2[0], VAR_2[1], VAR_2[2]);
    }
};