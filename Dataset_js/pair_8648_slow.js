const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
            return VAR_1 % 3 === 0 ? "Fizz" : "";
          },
          FUNCTION_2 = function (VAR_2) {
            return VAR_1 % 5 === 0 ? "Buzz" : "";
          },
          FUNCTION_3 = function (VAR_3) {
            return VAR_1 % 3 === 0;
          },
          FUNCTION_4 = function (VAR_4) {
            return VAR_1 % 5 === 0;
          },
          VAR_5 = "",
          VAR_6,
          VAR_7;
        for (VAR_1 = 0; VAR_1 < 101; VAR_1++) {
          VAR_5 += FUNCTION_1(VAR_1);
          VAR_5 += FUNCTION_2(VAR_1);
          VAR_7 = VAR_5 || VAR_1;
          VAR_5 = "";
        }
    }
};