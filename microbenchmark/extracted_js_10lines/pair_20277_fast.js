const Benchmark = {
    run: function() {
        var VAR_1 = "hello";
        var VAR_2 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
        };
        function FUNCTION_1() {
          var VAR_3 = VAR_1;
          var VAR_4 = VAR_2;
          return function () {
            return VAR_4;
          };
        }
        function FUNCTION_2() {
          return function () {
            return 12;
          };
        }
        FUNCTION_1();
    }
};