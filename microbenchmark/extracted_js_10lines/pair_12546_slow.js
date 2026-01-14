const Benchmark = {
    run: function() {
        for (var VAR_1 = 1; VAR_1 <= 100; VAR_1++) {
          if (VAR_1 % 3 != 0 && VAR_1 % 5 != 0) {
            VAR_2 = VAR_1;
          } else if (VAR_1 % 3 == 0 && VAR_1 % 5 != 0) {
            VAR_3 = "Fizz";
          } else if (VAR_1 % 5 == 0 && VAR_1 % 3 != 0) {
            VAR_4 = "Buzz";
          } else {
            VAR_5 = "FizzBuzz";
          }
        }
    }
};