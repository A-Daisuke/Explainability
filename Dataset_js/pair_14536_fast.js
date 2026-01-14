const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_4 = +VAR_1 + 1000000;
          if (VAR_4 > 1999999) return false;
          return (
            (VAR_4 % 10) +
              (((VAR_4 / 10) >> 0) % 10) +
              (((VAR_4 / 100) >> 0) % 10) -
              (((VAR_4 / 1000) >> 0) % 10) -
              (((VAR_4 / 10000) >> 0) % 10) -
              (((VAR_4 / 100000) >> 0) % 10) ===
            0
          );
        }
        FUNCTION_1("123123");
    }
};