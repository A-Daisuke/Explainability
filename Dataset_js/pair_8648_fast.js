const Benchmark = {
    run: function() {
        var FUNCTION_3 = function (VAR_3) {
            return VAR_3 % 3 === 0;
          },
          FUNCTION_4 = function (VAR_4) {
            return VAR_3 % 5 === 0;
          },
          VAR_5 = "",
          VAR_6,
          VAR_8,
          VAR_9,
          VAR_7;
        for (VAR_3 = 0; VAR_3 < 101; VAR_3++) {
          VAR_8 = VAR_3 % 3 === 0;
          VAR_9 = VAR_3 % 5 === 0;
          if (VAR_8) {
            VAR_5 += "Fizz";
            if (VAR_9) {
              VAR_5 += "Buzz";
            }
          } else if (VAR_9) {
            VAR_5 += "Buzz";
          }
          VAR_7 = VAR_5 || VAR_3;
          VAR_5 = "";
        }
    }
};