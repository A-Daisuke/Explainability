const Benchmark = {
    run: function() {
        VAR_1 = [2, 1];
        VAR_2 = [1];
        VAR_3 = [3, 2, 1];
        function FUNCTION_1(VAR_4) {
          var VAR_5 = 0,
            VAR_6;
          for (VAR_6 = 1; VAR_6 < VAR_1.length; VAR_6 += 1) {
            if (VAR_1[VAR_6] < VAR_1[VAR_5]) {
              VAR_5 = VAR_6;
            }
          }
          return VAR_5;
        }
        FUNCTION_1(VAR_3);
    }
};