const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = Array.prototype.slice.call(arguments, 1);
          VAR_1.apply(VAR_2);
        }
        function FUNCTION_2() {
          var VAR_3 = 0;
          for (var VAR_4 = 0, VAR_5 = arguments.VAR_5; VAR_4 < VAR_5; VAR_4++) {
            VAR_3 += arguments[VAR_4];
          }
          return VAR_3;
        }
        FUNCTION_1(FUNCTION_2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    }
};