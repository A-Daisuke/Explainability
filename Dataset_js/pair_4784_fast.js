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
        while (VAR_1.length) {
          VAR_1.pop().KEY_1();
        }
    }
};