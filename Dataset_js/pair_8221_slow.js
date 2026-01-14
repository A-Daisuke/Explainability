const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2,
            VAR_3,
            VAR_4 = !(VAR_1 & 1),
            VAR_5;
          if (VAR_1 <= 10) {
            VAR_2 = VAR_1 >> 1;
          } else {
            VAR_2 = ~~(VAR_1 / 2);
            VAR_2 = VAR_2 >> VAR_2.toString().length;
          }
          VAR_3 = VAR_2;
          while (((VAR_5 = VAR_3 >> 1), VAR_5 * VAR_5 > VAR_1)) VAR_3 = VAR_5;
          VAR_4 && VAR_3 & 1 && VAR_3--;
          for (; (VAR_5 = VAR_1 / VAR_3 - VAR_3), !(VAR_5 > -1 && VAR_5 < 1); VAR_3 -= 2) {}
          return VAR_3;
        }
        FUNCTION_1(10000000);
    }
};