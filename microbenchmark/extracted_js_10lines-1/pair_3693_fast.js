const Benchmark = {
    run: function() {
        var FUNCTION_2 = function (VAR_4, VAR_8, VAR_9) {
          if (VAR_4 === undefined) {
            VAR_4 = 3;
          }
          if (VAR_8 === undefined) {
            VAR_8 = [];
          }
          if (VAR_9 === undefined) {
            VAR_9 = [];
          }
          var VAR_3 = ["rock", "paper", "scissors"];
          for (var VAR_5 = 0; VAR_5 < VAR_3.length; VAR_5++) {
            var VAR_6 = VAR_8.slice();
            VAR_6.push(VAR_3[VAR_5]);
            if (VAR_4 === 1) {
              VAR_9.push(VAR_6);
            } else {
              FUNCTION_2(VAR_4 - 1, VAR_6, VAR_9);
            }
          }
          return VAR_9;
        };
        FUNCTION_2(3);
    }
};