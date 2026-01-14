const Benchmark = {
    run: function() {
        var VAR_1 = "";
        for (var VAR_2 = 1; VAR_2 <= 100; VAR_2++) {
          if (VAR_2 % 3 == 0 && VAR_2 % 5 == 0) {
            VAR_1 = "FizzBuzz";
          } else if (VAR_2 % 3 == 0) {
            VAR_1 = "Fizz";
          } else if (VAR_2 % 5 == 0) {
            VAR_1 = "Buzz";
          } else {
            VAR_1 = VAR_2;
          }
        }
    }
};