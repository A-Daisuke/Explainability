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
        var VAR_4 = FUNCTION_1(10000);
        (function (VAR_5) {
          VAR_5();
        })(FUNCTION_1(10000));
    }
};