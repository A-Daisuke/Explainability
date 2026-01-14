const Benchmark = {
    run: function() {
        var VAR_1 = [];
        VAR_1["key"] = 1;
        var VAR_2 = [];
        VAR_2["key"] = 2;
        var VAR_3 = [];
        VAR_3["key"] = 3;
        var VAR_4 = FUNCTION_1(VAR_1, VAR_2);
        var VAR_5 = FUNCTION_1(VAR_1, VAR_3);
        var VAR_6 = FUNCTION_1(VAR_2, VAR_1);
        var VAR_7 = FUNCTION_1(VAR_2, VAR_3);
        var VAR_8 = FUNCTION_1(VAR_3, VAR_1);
        var VAR_9 = FUNCTION_1(VAR_3, VAR_2);
        function FUNCTION_1(VAR_10, VAR_11) {
          var VAR_12 = Math.abs(VAR_10["key"] - VAR_11["key"]);
          return VAR_12 <= 1;
        }
    }
};