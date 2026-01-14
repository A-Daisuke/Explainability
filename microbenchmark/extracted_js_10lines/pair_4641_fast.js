const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = 0;
          for (var VAR_3 = 0; VAR_3 < VAR_1; VAR_3++) {
            ++VAR_2;
          }
          return function () {
            return VAR_2;
          };
        }
        function FUNCTION_2(VAR_6) {
          var VAR_7 = 0;
          for (var VAR_8 = 0; VAR_8 < VAR_6; VAR_8++) {
            ++VAR_7;
          }
          return VAR_7;
        }
        var VAR_4 = FUNCTION_1(10000);
        var VAR_9 = FUNCTION_2;
        (function (VAR_5) {
          VAR_5(10000);
        })(VAR_9);
    }
};