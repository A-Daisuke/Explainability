const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          if (typeof VAR_1 !== "number" || typeof VAR_2 !== "number") {
            throw "inputs must be 2 numbers";
          }
          var VAR_3 = [];
          var VAR_7;
          var VAR_8;
          if (VAR_1 < VAR_2) {
            VAR_7 = VAR_1;
            VAR_8 = VAR_2;
          } else {
            VAR_7 = VAR_2;
            VAR_8 = VAR_1;
          }
          for (var VAR_6 = VAR_7; VAR_6 > 0; VAR_6--) {
            if (VAR_7 % VAR_6 === 0 && VAR_8 % VAR_6 === 0) {
              VAR_3.push(VAR_6);
            }
          }
          return VAR_3;
        };
        FUNCTION_1(500000, 25000000);
    }
};