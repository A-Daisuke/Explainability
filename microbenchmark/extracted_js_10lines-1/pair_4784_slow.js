const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = 100;
        while (VAR_2--) {
          VAR_1.push({
            KEY_1: function () {
              return null;
            },
          });
        }
        while (VAR_1[0]) {
          VAR_1.shift().KEY_1();
        }
    }
};