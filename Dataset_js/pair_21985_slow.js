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
        var VAR_5 = ["x", "y"];
        FUNCTION_1(function (VAR_6) {});
    }
};