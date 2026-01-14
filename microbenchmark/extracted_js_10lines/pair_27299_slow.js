const Benchmark = {
    run: function() {
        var VAR_1 = undefined;
        var VAR_2 = null;
        var VAR_3 = { KEY_1: 1 };
        var VAR_4 = "undefined";
        function FUNCTION_1(VAR_5) {
          return typeof VAR_5 == "undefined";
        }
        function FUNCTION_2(VAR_6) {
          return VAR_6 === undefined;
        }
        var VAR_7 = "undefined";
        var VAR_8 = VAR_7 == typeof VAR_1;
        var VAR_9 = VAR_7 == typeof VAR_2;
        var VAR_10 = VAR_7 == typeof VAR_3;
    }
};