const Benchmark = {
    run: function() {
        var VAR_3 = [];
        var FUNCTION_2 = function () {
          VAR_3.push("a");
          VAR_3.push("b");
          VAR_3.push("c");
          VAR_3.push("d");
          VAR_3.push("e");
          VAR_3.push("f");
          VAR_3.push("g");
          VAR_3.push("h");
        };
        FUNCTION_2();
    }
};