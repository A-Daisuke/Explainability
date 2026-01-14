const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return function (VAR_2) {
            return function (VAR_3) {
              return VAR_3 < VAR_1 ? VAR_1 : VAR_3 > VAR_2 ? VAR_2 : VAR_3;
            };
          };
        }
        function FUNCTION_2(VAR_4, VAR_5, VAR_6) {
          return VAR_6 < VAR_4 ? VAR_4 : VAR_6 > VAR_5 ? VAR_5 : VAR_6;
        }
        var VAR_7 = FUNCTION_1(0)(10);
        VAR_7(500);
    }
};