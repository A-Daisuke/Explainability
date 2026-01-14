const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return [].slice.call(arguments, 1, arguments.length);
        }
        function FUNCTION_2() {
          var VAR_1 = [];
          for (var VAR_2 = 1; VAR_2 < arguments.length; VAR_2++) {
            VAR_1.push(arguments[VAR_2]);
          }
          return VAR_1;
        }
        FUNCTION_2(1, 2, 3, 4, "a string", {
          KEY_1: "an object",
          KEY_2: 42,
        });
    }
};