const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          VAR_1 = Number(VAR_1) + 1000000;
          var VAR_2 = 0,
            VAR_3 = 0;
          if (VAR_1 > 1999999) return false;
          VAR_2 += Number.parseInt((VAR_1 % 1000000) / 100000);
          VAR_2 += Number.parseInt((VAR_1 % 100000) / 10000);
          VAR_2 += Number.parseInt((VAR_1 % 10000) / 1000);
          VAR_3 += Number.parseInt((VAR_1 % 1000) / 100);
          VAR_3 += Number.parseInt((VAR_1 % 100) / 10);
          VAR_3 += Number.parseInt((VAR_1 % 10) / 1);
          return VAR_2 == VAR_3;
        }
        FUNCTION_1("123123");
    }
};