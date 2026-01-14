const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_7 = 0,
            VAR_8 = 1,
            VAR_2,
            VAR_9 = [0, 1];
          for (var VAR_6 = 2; VAR_6 < VAR_1; VAR_6++) {
            VAR_2 = VAR_7 + VAR_8;
            VAR_7 = VAR_8;
            VAR_8 = VAR_2;
            VAR_9.push(VAR_2);
          }
          return VAR_9;
        }
        FUNCTION_1(1000);
    }
};