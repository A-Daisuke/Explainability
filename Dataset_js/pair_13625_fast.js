const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return Array.prototype.slice.call(arguments, 1);
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