const Benchmark = {
    run: function() {
        VAR_1 = { KEY_1: 1 };
        var VAR_2 = 0;
        function FUNCTION_1() {
          VAR_1.KEY_1 = ++VAR_2;
        }
        var VAR_3;
        for (VAR_3 = 0; VAR_3 < 100; VAR_3++) {
          VAR_1.KEY_1 = null;
          FUNCTION_1();
        }
    }
};