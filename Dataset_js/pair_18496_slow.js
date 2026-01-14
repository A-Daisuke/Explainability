const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        var VAR_1 = "nomatch";
        var VAR_2 = "dog";
        var VAR_3 = ["cat", "dog", "horse"];
        if (/^(cat|dog|horse)$/.test(VAR_1)) {
          FUNCTION_1();
        }
        if (/^(cat|dog|horse)$/.test(VAR_2)) {
          FUNCTION_1();
        }
    }
};