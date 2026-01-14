const Benchmark = {
    run: function() {
        !(function () {
          var VAR_1 = 1,
            VAR_2 = 2,
            VAR_3 = true;
          function FUNCTION_1() {
            var VAR_4 = 2;
            VAR_5 = !VAR_3;
          }
          for (var VAR_6 = 0; VAR_6 < 100; VAR_6++) {
            FUNCTION_1(VAR_6, VAR_6 + 1, VAR_6 + 2);
          }
        })();
        !(function () {
          eval("");
        })();
    }
};