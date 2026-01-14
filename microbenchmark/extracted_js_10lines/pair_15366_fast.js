const Benchmark = {
    run: function() {
        var VAR_1 = ["abc", "abc", "abc"];
        var VAR_6 = ["", "abc", "abc"];
        var VAR_2 = ["", "", "abc"];
        var VAR_4 = [undefined, undefined, "abc"];
        var FUNCTION_2 = function (VAR_7, VAR_8, VAR_9) {
          if (VAR_7 !== undefined) {
            return VAR_7;
          }
          if (VAR_8 !== undefined) {
            return VAR_8;
          }
          return VAR_9;
        };
        FUNCTION_2(VAR_6[0], VAR_6[1], VAR_6[2]);
    }
};