const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          var VAR_3 = 500;
          while (VAR_2--) {
            VAR_1.push(Math.random());
          }
        };
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_5 < 10; VAR_5 += 1) {
          FUNCTION_1(VAR_4, 500);
          while (VAR_4.length > 0) {
            var VAR_6 = VAR_4.shift();
          }
        }
    }
};