const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          return VAR_1.replace(/^\s+|\s+$/g, "");
        };
        var FUNCTION_2 = function (VAR_2) {
          return VAR_1.trim();
        };
        var VAR_3 = "Hello, world!";
        var VAR_4 = " Hello, world!";
        var VAR_5 = "Hello, world!\t";
        var VAR_6 = "   Hello, world! \t ";
        FUNCTION_1(VAR_3);
        FUNCTION_1(VAR_4);
        FUNCTION_1(VAR_5);
        FUNCTION_1(VAR_6);
    }
};