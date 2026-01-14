const Benchmark = {
    run: function() {
        var VAR_1 = undefined;
        var VAR_2 = null;
        var VAR_3 = { KEY_1: 1 };
        var VAR_4 = "undefined";
        function FUNCTION_2(VAR_6) {
          return VAR_6 === undefined;
        }
        var VAR_10 = "undefined" == typeof VAR_1;
        var VAR_11 = "undefined" == typeof VAR_2;
        var VAR_12 = "undefined" == typeof VAR_3;
    }
};