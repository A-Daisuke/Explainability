const Benchmark = {
    run: function() {
        var VAR_1 = 100;
        var VAR_2 = 0;
        var VAR_3 = 0;
        FUNCTION_1 = function (VAR_4) {
          var VAR_5 = VAR_4.toString();
          var VAR_6 = VAR_5.split("").reverse().join("");
          if (VAR_5 == VAR_6) {
            return true;
          }
        };
        for (VAR_7 = 999; VAR_7 >= 100; VAR_7--) {
          for (VAR_8 = 999; VAR_8 >= VAR_7; VAR_8--) {
            VAR_9 = VAR_7 * VAR_8;
            if (VAR_9 > VAR_2 && FUNCTION_1(VAR_9)) {
              VAR_2 = VAR_9;
            }
          }
        }
        console.log(VAR_2);
    }
};