const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        var VAR_1 = "nomatch";
        var VAR_2 = "dog";
        var VAR_3 = ["cat", "dog", "horse"];
        if (VAR_1 === "cat" || VAR_1 === "dog" || VAR_1 === "horse") {
          FUNCTION_1();
        }
        if (VAR_2 === "cat" || VAR_2 === "dog" || VAR_2 === "horse") {
          FUNCTION_1();
        }
    }
};