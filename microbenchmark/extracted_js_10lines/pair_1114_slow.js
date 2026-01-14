const Benchmark = {
    run: function() {
        var VAR_1 = "abcdefghijhiklmn";
        var FUNCTION_1 = function (VAR_2) {
          var VAR_3 = VAR_2.length;
          var VAR_4 = [];
          for (var VAR_5 = 0; VAR_5 < Math.pow(2, VAR_3); VAR_5++) {
            var VAR_6 = "";
            for (var VAR_7 = 0; VAR_7 < VAR_3; VAR_7++) {
              if (VAR_5 & (1 << VAR_7)) {
                VAR_6 += VAR_2[VAR_7];
              }
            }
            VAR_4.push(VAR_6);
          }
          return VAR_4;
        };
        FUNCTION_1(VAR_1);
    }
};