const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = Math.random();
          var VAR_2 = Math.random();
          var VAR_3 = Math.random();
          var VAR_4 = Math.random();
          var VAR_5 = Math.random();
          var VAR_6 = Math.random();
          var VAR_7 = Math.random();
          var VAR_8 = Math.random();
          var VAR_9 = Math.random();
          var VAR_10 = Math.random();
          return 1000000;
        }
        for (var VAR_11 = 0; VAR_11 < FUNCTION_1(); ++VAR_11) {
          var VAR_12 = 0.000001;
        }
    }
};