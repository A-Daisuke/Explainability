const Benchmark = {
    run: function() {
        function FUNCTION_3(VAR_10, VAR_11, VAR_12) {
          VAR_10 = +VAR_10;
          VAR_11 = +VAR_11;
          VAR_12 = +VAR_12;
          return VAR_10 + VAR_11 * VAR_12;
        }
        function FUNCTION_1(VAR_1, VAR_2, VAR_3) {
          var VAR_4 = +VAR_1;
          var VAR_5 = +VAR_2;
          var VAR_6 = +VAR_3;
          return VAR_4 + VAR_5 * VAR_6;
        }
        function FUNCTION_2(VAR_7, VAR_8, VAR_9) {
          VAR_7 = Number(VAR_7);
          VAR_8 = Number(VAR_8);
          VAR_9 = Number(VAR_9);
          return VAR_7 + VAR_8 * VAR_9;
        }
        var VAR_16 = FUNCTION_3(1, 2, 3);
    }
};