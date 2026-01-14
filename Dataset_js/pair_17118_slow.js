const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {
          var VAR_1 = 0;
          VAR_1 += arguments[0];
          VAR_1 += arguments[1];
          VAR_1 += arguments[2];
          VAR_1 += arguments[3];
          VAR_1 += arguments[4];
          VAR_1 += arguments[5];
          VAR_1 += arguments[6];
          VAR_1 += arguments[7];
          VAR_1 += arguments[8];
          VAR_1 += arguments[9];
          return VAR_1;
        };
        var VAR_2 = FUNCTION_1(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    }
};