const Benchmark = {
    run: function() {
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
        function FUNCTION_3(VAR_10, VAR_11, VAR_12) {
          var VAR_13 = Number(VAR_10);
          var VAR_14 = Number(VAR_11);
          var VAR_15 = Number(VAR_12);
          return VAR_13 + VAR_14 * VAR_15;
        }
        var VAR_16 = FUNCTION_2(1, 2, 3);
    }
};