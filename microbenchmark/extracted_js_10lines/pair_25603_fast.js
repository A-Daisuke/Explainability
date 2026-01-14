const Benchmark = {
    run: function() {
        var VAR_1 = 10;
        var VAR_2 = { KEY_1: 10 };
        var VAR_3 = { KEY_2: { KEY_3: 10 } };
        function FUNCTION_1() {
          return 10;
        }
        function FUNCTION_3() {
          function FUNCTION_4() {
            return VAR_1;
          }
          return FUNCTION_1();
        }
        var VAR_4 = VAR_1;
    }
};