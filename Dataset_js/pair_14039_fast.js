const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2];
        var VAR_2 = [2, 3];
        var VAR_3 = 1;
        var VAR_4 = 2;
        var VAR_5 = 2;
        var VAR_6 = 3;
        var VAR_7 = [0, 0];
        function FUNCTION_1(VAR_8, VAR_9) {
          var VAR_10 = [0, 0];
          VAR_10[0] = VAR_1[0] + VAR_2[0];
          VAR_10[1] = VAR_1[1] + VAR_2[1];
          return VAR_10;
        }
        function FUNCTION_2(VAR_11, VAR_12, VAR_13, VAR_14) {
          VAR_7[0] = VAR_3 + VAR_4;
          VAR_7[1] = VAR_5 + VAR_6;
          return VAR_7;
        }
        FUNCTION_2(VAR_3, VAR_4, VAR_5, VAR_6);
        const VAR_17 = VAR_7[0];
        const VAR_18 = VAR_7[1];
    }
};