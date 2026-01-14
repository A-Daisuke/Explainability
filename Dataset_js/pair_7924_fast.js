const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
            return VAR_1 % 3 === 0 ? "Fizz" : "";
          },
          FUNCTION_2 = function (VAR_2) {
            return VAR_1 % 5 === 0 ? "Buzz" : "";
          },
          VAR_7 = "",
          VAR_5,
          VAR_8,
          VAR_9,
          VAR_6;
        for (VAR_1 = 0; VAR_1 < 101; VAR_1++) {
          VAR_8 = VAR_1 % 3 === 0;
          VAR_9 = VAR_1 % 5 === 0;
          if (VAR_8) {
            VAR_7 += "Fizz";
            if (VAR_9) {
              VAR_7 += "Buzz";
            }
          } else if (VAR_9) {
            VAR_7 += "Buzz";
          }
          VAR_6 = VAR_7 || VAR_1;
          VAR_7 = "";
        }
    }
};