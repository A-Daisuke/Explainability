const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          VAR_1 = String(VAR_1);
          var VAR_2 = 0,
            VAR_3 = 0,
            VAR_4 = VAR_1.length;
          if (VAR_4 != 6) return false;
          for (var VAR_5 = 0; VAR_5 < 3; VAR_5++) {
            VAR_2 += +VAR_1[VAR_5];
            VAR_3 += +VAR_1[VAR_4 - VAR_5 - 1];
          }
          return VAR_2 == VAR_3;
        }
        FUNCTION_1("123123");
    }
};