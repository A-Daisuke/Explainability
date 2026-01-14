const Benchmark = {
    run: function() {
        var VAR_1, VAR_2, VAR_3, VAR_4;
        VAR_1 = 1000;
        VAR_2 = (function () {
          var VAR_5, VAR_6;
          VAR_6 = [];
          for (VAR_3 = VAR_5 = 0; 0 <= VAR_1 ? VAR_5 < VAR_1 : VAR_5 > VAR_1; VAR_3 = 0 <= VAR_1 ? ++VAR_5 : --VAR_5) {
            VAR_6.push({ KEY_1: VAR_3++ });
          }
          return VAR_6;
        })();
        VAR_4 = [];
        VAR_2.forEach(function (VAR_7) {
          VAR_4.push(VAR_7.KEY_1);
        });
    }
};