const Benchmark = {
    run: function() {
        VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 20; VAR_2++) {
          VAR_1.push(Math.floor(Math.random() * 1000));
        }
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_2 < VAR_1.length; VAR_2++) {
          VAR_4.push(VAR_1[VAR_2]);
        }
        VAR_4 = VAR_4.filter(function (VAR_7, VAR_8, VAR_9) {
          return VAR_8 === VAR_9.indexOf(VAR_7);
        });
    }
};