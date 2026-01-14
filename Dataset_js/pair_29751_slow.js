const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2) {
          if (!VAR_1 || !VAR_2) {
            return undefined;
          }
          var VAR_3 = [];
          var VAR_4 = VAR_1 > VAR_2 ? VAR_1 : VAR_2;
          var VAR_5 = Math.floor(VAR_4 / 2);
          for (var VAR_6 = VAR_5; VAR_6 >= 1; VAR_6--) {
            if (VAR_1 % VAR_6 === 0 && VAR_2 % VAR_6 === 0) {
              VAR_3.push(VAR_6);
            }
          }
          return VAR_3;
        };
        FUNCTION_1(500000, 25000000);
    }
};