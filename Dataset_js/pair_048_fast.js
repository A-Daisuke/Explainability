const Benchmark = {
    run: function() {
    (function () {
      var VAR_5 = 0;
      var VAR_6 = [];
      while (VAR_5++ < 5000) {
        var VAR_7 = {
          KEY_1: VAR_5,
          KEY_2: VAR_5,
        };
        VAR_6.push(VAR_7);
      }
      if (VAR_6.length != 5000) throw new Error();
    })();
    }
};
