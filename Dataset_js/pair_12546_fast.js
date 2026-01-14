const Benchmark = {
    run: function() {
        var VAR_6 = "",
          VAR_7 = 0,
          VAR_8 = 0;
        for (var VAR_1 = 1; VAR_1 <= 100; VAR_1++) {
          VAR_7 = VAR_1 % 3 == 0;
          VAR_8 = VAR_1 % 5 == 0;
          if (VAR_7 && VAR_8) {
            VAR_6 = "FizzBuzz";
          } else if (VAR_7) {
            VAR_6 = "Fizz";
          } else if (VAR_8) {
            VAR_6 = "Buzz";
          } else {
            VAR_6 = VAR_1;
          }
        }
    }
};