const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = [];
          for (var VAR_2 = 1; VAR_2 < arguments.length; VAR_2++) {
            VAR_1.push(arguments[VAR_2]);
          }
          return VAR_1;
        }
        function FUNCTION_2() {
          return underscore.toArray(arguments).slice(1);
        }
        function FUNCTION_3() {
          return lodash.toArray(arguments).slice(1);
        }
        FUNCTION_1(1, 2, 3, 4, 5, 6);
    }
};