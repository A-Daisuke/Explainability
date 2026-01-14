const Benchmark = {
    run: function() {
        var VAR_1, VAR_2;
        VAR_1 = [
          "/62",
          "/15",
          "/65",
          "/62",
          "/15",
          "/08",
          "/01",
          "/65",
          "/62",
          "/65",
          "/62",
          "/15",
          "/01",
        ];
        VAR_2 = VAR_1.filter(function (VAR_3, VAR_4, VAR_5) {
          return VAR_5.indexOf(VAR_3) === VAR_4;
        });
    }
};