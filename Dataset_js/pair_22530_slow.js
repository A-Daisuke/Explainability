const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var FUNCTION_2 = function () {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
          };
          return (
            FUNCTION_2() +
            FUNCTION_2() +
            "-" +
            FUNCTION_2() +
            "-" +
            FUNCTION_2() +
            "-" +
            FUNCTION_2() +
            "-" +
            FUNCTION_2() +
            FUNCTION_2() +
            FUNCTION_2()
          );
        }
        var VAR_1;
        for (var VAR_2 = 0; VAR_2 < 10; VAR_2++) VAR_1 = FUNCTION_1();
    }
};