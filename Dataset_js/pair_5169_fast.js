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
        var VAR_8;
        VAR_4 = (function () {
          var VAR_9, VAR_10, VAR_11;
          VAR_6 = [];
          for (VAR_5 = 0, VAR_10 = VAR_2.length; VAR_5 < VAR_10; VAR_5++) {
            VAR_8 = VAR_2[VAR_5];
            VAR_6.push(VAR_8.KEY_1);
          }
          return VAR_6;
        })();
    }
};