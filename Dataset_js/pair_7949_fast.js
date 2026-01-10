const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
          var VAR_3 = {};
          VAR_3.VAR_4 = "Test event";
          VAR_3.VAR_5 = new Date();
          VAR_3.VAR_6 = new Date();
          VAR_1.push(VAR_3);
        }
        var VAR_7 = (function () {
          var VAR_8 = "";
          for (var VAR_9 = 0, VAR_10 = VAR_1.length; VAR_2 < VAR_10; VAR_2++) {
            var VAR_11 = VAR_1[VAR_2];
            VAR_8 = VAR_8 + VAR_3.id + VAR_3.VAR_4 + VAR_3.url + VAR_3.VAR_5 + VAR_3.VAR_6 + VAR_3.allDay;
          }
          return VAR_8;
        })();
        VAR_7 === VAR_7;
    }
};