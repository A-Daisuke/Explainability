const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return 1;
        }
        function FUNCTION_2() {
          return 1;
        }
        var VAR_1 = 0,
          VAR_2;
        for (VAR_2 = 0; VAR_2 < 100; VAR_2++) {
          VAR_1 += FUNCTION_2();
        }
    }
};