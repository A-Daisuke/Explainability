const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_3, VAR_4, VAR_5, VAR_6, VAR_7, VAR_8, VAR_9, VAR_10, VAR_11, VAR_12) {
          var VAR_1 = 0;
          VAR_1 += VAR_3;
          VAR_1 += VAR_4;
          VAR_1 += VAR_5;
          VAR_1 += VAR_6;
          VAR_1 += VAR_7;
          VAR_1 += VAR_8;
          VAR_1 += VAR_9;
          VAR_1 += VAR_10;
          VAR_1 += VAR_11;
          VAR_1 += VAR_12;
          return VAR_1;
        };
        var VAR_2 = FUNCTION_1(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    }
};