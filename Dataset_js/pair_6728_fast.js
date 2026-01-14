const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = [],
            FUNCTION_2 = function (VAR_4) {
              return {
                KEY_1: VAR_4,
                KEY_2: VAR_4.toString(),
              };
            };
          for (; VAR_1 < VAR_2; VAR_1++) {
            VAR_3.push(FUNCTION_2(VAR_1));
          }
          return VAR_3;
        }
        function FUNCTION_3(VAR_5, VAR_6, VAR_7) {
          return VAR_5.KEY_1 % 2;
        }
        FUNCTION_1(0, 100).some(FUNCTION_3);
    }
};