const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          var VAR_1 = [];
          VAR_1.push.apply(VAR_1, arguments);
          return VAR_1;
        }
        function FUNCTION_2() {
          var VAR_2 = Array.prototype.slice.call(arguments);
          return VAR_2;
        }
        function FUNCTION_3() {
          var VAR_3 = Array.from(arguments);
          return VAR_3;
        }
        function FUNCTION_4() {
          var VAR_4 = [];
          for (var VAR_5 = 0, VAR_6 = arguments.length; VAR_5 < VAR_6; VAR_5++) {
            VAR_1[VAR_7] = arguments[VAR_5];
          }
          return VAR_4;
        }
        FUNCTION_3(1, 2, 3, 4);
    }
};