const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_3 = 0; VAR_3 < 100000; VAR_3++) {
          VAR_1.push({ KEY_1: VAR_3 });
        }
        (function () {
          var VAR_5 = 0;
          VAR_6 = VAR_1.map(function (VAR_7) {
            VAR_5 = VAR_7.KEY_1;
            if (VAR_5 % 2 === 0) {
              return VAR_5;
            } else {
              return 0;
            }
          });
        })();
    }
};