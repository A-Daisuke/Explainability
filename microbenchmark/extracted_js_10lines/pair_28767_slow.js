const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_3 = VAR_1.slice(0, VAR_2);
          var VAR_4 = VAR_1.VAR_4;
          for (var VAR_5 = VAR_4; VAR_5 < VAR_2; VAR_5++) {
            VAR_3[VAR_6] = 0;
            for (var VAR_7 = 1; VAR_7 <= VAR_4; VAR_7++) {
              VAR_3[VAR_8] += VAR_3[VAR_5 - VAR_7];
            }
          }
          return VAR_3;
        }
        FUNCTION_1([1, 1, 1, 1], 10);
    }
};