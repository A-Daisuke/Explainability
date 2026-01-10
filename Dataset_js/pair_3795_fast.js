const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          let VAR_5 = 1,
            VAR_6 = 1;
          if (VAR_1 === 1) {
            return 1;
          } else {
            let VAR_7 = VAR_1 - 1;
            while (VAR_7) {
              let VAR_8 = VAR_6;
              VAR_6 += VAR_5;
              VAR_5 = VAR_8;
              VAR_7--;
            }
          }
          return VAR_6;
        }
        function FUNCTION_2(VAR_2, VAR_3) {
          VAR_3 = VAR_3 || {};
          if (VAR_3[VAR_1]) {
            return VAR_3[VAR_1];
          }
          if (VAR_2 <= 1) {
            return 1;
          }
          return (VAR_3[VAR_4] = FUNCTION_2(VAR_2 - 1, VAR_3) + FUNCTION_2(VAR_2 - 2, VAR_3));
        }
        FUNCTION_1(15);
    }
};