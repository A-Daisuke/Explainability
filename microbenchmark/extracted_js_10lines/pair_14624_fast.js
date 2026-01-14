const Benchmark = {
    run: function() {
        var VAR_1;
        function FUNCTION_1() {
          var VAR_4 = {
            KEY_3: "test",
            KEY_4: "object",
          };
          return VAR_4;
        }
        VAR_1 = {
          KEY_1: "test",
          KEY_2: "object",
        };
        var VAR_2 = 10000;
        var VAR_3;
        while (VAR_2--) {
          VAR_3 = FUNCTION_1();
        }
    }
};