const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [];
        for (var VAR_3 = 0; VAR_3 < 100000; VAR_3++) {
          VAR_1.push({ KEY_1: VAR_3 });
        }
        (function () {
          for (var VAR_4 = 0; VAR_3 < VAR_1.length; VAR_3++) {
            if (VAR_1[VAR_3].KEY_1 % 2 === 0) {
              VAR_2.push(VAR_1[VAR_3].KEY_1);
            } else {
              VAR_2.push(0);
            }
          }
        })();
    }
};