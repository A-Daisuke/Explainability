const Benchmark = {
    run: function() {
        var VAR_1, VAR_6, VAR_7, VAR_2, VAR_8, VAR_9, VAR_3;
        VAR_1 = function () {
          VAR_3 = [];
          for (VAR_2 = 0; VAR_2 < 10000; VAR_2++) {
            VAR_3.push(VAR_2);
          }
          return VAR_3;
        }.apply(this);
        VAR_6 = null;
        for (VAR_8 = 0, VAR_9 = VAR_1.length; VAR_8 < VAR_9; VAR_8++) {
          VAR_7 = VAR_1[VAR_8];
          VAR_6 = VAR_7;
        }
    }
};