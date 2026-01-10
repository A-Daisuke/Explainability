const Benchmark = {
    run: function() {
        var VAR_1 = [
          "2015-02-09T17:37:49.247",
          "2015-02-09T17:37:49.247",
          "2015-02-09T17:37:49.247",
          "2015-02-09T17:37:49.247",
          "2015-02-09T17:37:49.247",
          "2015-02-09T17:37:49.247",
        ];
        VAR_1.forEach(function (VAR_2) {
          var VAR_3 = VAR_2.replace(
            /(\d{4})-(\d{2})-(\d{2}).*/,
            function (VAR_4, VAR_5, VAR_6, VAR_7) {
              return VAR_7 + "." + VAR_6 + "...." + VAR_5;
            },
          );
        });
    }
};