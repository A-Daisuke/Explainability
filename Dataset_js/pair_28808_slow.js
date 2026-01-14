const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2,
            VAR_3,
            VAR_4,
            VAR_5 = [];
          for (var VAR_6 = 1; VAR_6 < VAR_1; VAR_6++) {
            if (VAR_6 === 1) {
              VAR_2 = 0;
              VAR_3 = 1;
              VAR_5.push(VAR_2, VAR_3);
              continue;
            }
            VAR_4 = VAR_2 + VAR_3;
            VAR_2 = VAR_3;
            VAR_3 = VAR_4;
            VAR_5.push(VAR_4);
          }
          return VAR_5;
        }
        FUNCTION_1(1000);
    }
};