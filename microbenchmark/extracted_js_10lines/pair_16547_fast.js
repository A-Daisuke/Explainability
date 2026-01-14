const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return arguments.length == 1 ? [arguments[0]] : Array.apply(null, arguments);
        }
        function FUNCTION_2() {
          return Array.prototype.slice.call(arguments);
        }
        function FUNCTION_3() {
          return [].slice.call(arguments);
        }
        FUNCTION_1(0);
    }
};