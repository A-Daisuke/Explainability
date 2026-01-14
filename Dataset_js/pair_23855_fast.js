const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_6 = +VAR_1 + 1000000;
          var VAR_2 = 0;
          if (VAR_6 > 1999999) return false;
          VAR_2 += VAR_6 % 10;
          VAR_6 = (VAR_6 / 10) >> 0;
          VAR_2 += VAR_6 % 10;
          VAR_6 = (VAR_6 / 10) >> 0;
          VAR_2 += VAR_6 % 10;
          VAR_6 = (VAR_6 / 10) >> 0;
          VAR_2 -= VAR_6 % 10;
          VAR_6 = (VAR_6 / 10) >> 0;
          VAR_2 -= VAR_6 % 10;
          VAR_6 = (VAR_6 / 10) >> 0;
          VAR_2 -= VAR_6 % 10;
          return VAR_2 == 0;
        }
        FUNCTION_1("123123");
    }
};