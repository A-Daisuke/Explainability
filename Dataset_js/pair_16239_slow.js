const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          VAR_1("x");
          VAR_1("y");
        };
        var FUNCTION_2 = function (VAR_2) {
          VAR_1(VAR_3);
          VAR_1(VAR_4);
        };
        var VAR_3 = "x",
          VAR_4 = "y";
        var VAR_5 = {
          KEY_1: 0,
          KEY_2: 0,
        };
        var VAR_6 = ["x", "y"];
        for (var VAR_7 in ["x", "y"]) {
          VAR_8 = VAR_6[VAR_7];
        }
    }
};