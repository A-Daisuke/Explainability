const Benchmark = {
    run: function() {
        var VAR_4 = (function () {
          var VAR_5;
          return function VAR_4() {
            if (!VAR_5) VAR_5 = 1;
            return VAR_5;
          };
        })();
        var VAR_2 = 0;
        for (var VAR_3 = 0; VAR_3 < 10000; VAR_3++) VAR_2 += VAR_4();
        VAR_2;
    }
};