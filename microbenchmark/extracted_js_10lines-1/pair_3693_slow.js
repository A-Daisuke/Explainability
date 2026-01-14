const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          var VAR_2 = [];
          var VAR_3 = ["rock", "paper", "scissors"];
          var FUNCTION_2 = function (VAR_4) {
            if (VAR_4.length === VAR_1) {
              VAR_2.push(VAR_4);
            } else {
              for (var VAR_5 = 0; VAR_5 < VAR_3.length; VAR_5++) {
                var VAR_6 = VAR_4.slice();
                VAR_6.push(VAR_3[VAR_5]);
                FUNCTION_2(VAR_6);
              }
            }
          };
          FUNCTION_2([]);
          return VAR_2;
        };
        var VAR_7 = FUNCTION_1(5);
    }
};