const Benchmark = {
    run: function() {
    var VAR_1 = 1000;
    do {
      VAR_1--;
      VAR_2 = VAR_1.toString();
      if (VAR_2[0] === VAR_2[2]) {
        if (FUNCTION_1(VAR_1)) {
          console.log(VAR_1);
          break;
        }
      }
    } while (true);
    function FUNCTION_1(VAR_3) {
      for (var VAR_4 = 1; VAR_4 <= VAR_3 / 2; VAR_4 = VAR_4 + 2) {
        if (VAR_3 % VAR_4 == 0) {
          if (VAR_4 !== 1) {
            return false;
          }
        }
      }
      return true;
    }
    }
};
