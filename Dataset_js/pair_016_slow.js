const Benchmark = {
    run: function() {
    var VAR_1 = ["a", "b", "c", "d"];
    var VAR_2 = VAR_1.slice();
    var VAR_3 = [];
    VAR_1.forEach(function (VAR_4, VAR_5) {
      VAR_2.forEach(function (VAR_6, VAR_7) {
        if (VAR_4 != VAR_6) {
          VAR_3.push(VAR_4 + " - " + VAR_6);
        }
      });
      VAR_2.shift();
    });
    }
};
