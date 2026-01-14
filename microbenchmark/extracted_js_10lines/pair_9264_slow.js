const Benchmark = {
    run: function() {
        var VAR_1 = [2, 4, 5, 8, 9];
        var VAR_2 = [12, 55, 3, 6, 11, 12, 55];
        var FUNCTION_1 = function (VAR_3, VAR_4) {
          var VAR_5 = [];
          while (VAR_3.length > 0 && VAR_4.length > 0) {
            var VAR_6 = VAR_3[0] < VAR_4[0] ? VAR_3 : VAR_4;
            VAR_5.push(VAR_6.shift());
          }
          return VAR_5.concat(VAR_3, VAR_4);
        };
        FUNCTION_1(VAR_1, VAR_2);
    }
};