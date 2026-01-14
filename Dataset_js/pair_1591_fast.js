const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_4 = VAR_1 + 1;
          var VAR_5 = VAR_1 + 2;
          var VAR_6 = VAR_1 + 3;
          var VAR_7 = VAR_1 + 4;
          var VAR_8 = VAR_1 + 5;
          var VAR_9 = VAR_1 + 6;
          return [VAR_4, VAR_5, VAR_6, VAR_7, VAR_8, VAR_9];
        }
        for (var VAR_3 = 0; VAR_3 < 10000; ++VAR_3) FUNCTION_1(VAR_3);
    }
};