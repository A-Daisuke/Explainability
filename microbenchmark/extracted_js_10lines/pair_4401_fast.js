const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          var VAR_5 = "";
          while (VAR_2 > 0) {
            if (VAR_2 == 1) {
              VAR_5 += VAR_1.toString();
              break;
            }
            var VAR_3 = Math.pow(2, VAR_2 - 1);
            var VAR_4 = Math.pow(2, VAR_2);
            if (VAR_1 < VAR_3) {
              VAR_5 += "0";
            } else {
              VAR_5 += "1";
              VAR_1 = VAR_4 - VAR_1 - 1;
            }
            VAR_2--;
          }
          return VAR_5;
        };
        FUNCTION_1(5, 3);
    }
};