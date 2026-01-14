const Benchmark = {
    run: function() {
        function FUNCTION_2(VAR_4, VAR_5) {
          if (VAR_4 == VAR_5) {
            return VAR_4.length;
          }
          var VAR_6 = 0,
            VAR_7 = VAR_4.length,
            VAR_8 = 0,
            VAR_9 = 0,
            VAR_3 = 0;
          while (VAR_6 < VAR_7) {
            VAR_8 = Math.round((VAR_6 + VAR_7) / 2);
            if (VAR_4.substring(VAR_6, VAR_8) == VAR_5.substring(VAR_6, VAR_8)) {
              VAR_9 += VAR_8 - VAR_6;
              VAR_6 = VAR_8;
            } else {
              VAR_7 = VAR_8 - 1;
            }
            VAR_3++;
          }
          return VAR_9;
        }
        FUNCTION_2("1234567890", "1234567890x");
    }
};