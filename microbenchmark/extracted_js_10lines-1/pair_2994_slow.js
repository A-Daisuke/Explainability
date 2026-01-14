const Benchmark = {
    run: function() {
        var VAR_1 = 0,
          VAR_2 = 1000;
        var VAR_3 = [];
        for (; VAR_1 < VAR_2; VAR_1++) {
          VAR_3.push({
            KEY_1: VAR_1,
            KEY_2: "item-" + VAR_1.toString(),
          });
          if (VAR_1 % 5 === 0) {
            VAR_3[VAR_3.length - 1].VAR_4 = true;
          }
        }
        for (VAR_1 = 0, VAR_2 = VAR_3.length; VAR_1 < VAR_2; VAR_1++) {
          delete VAR_3[VAR_1].VAR_4;
        }
    }
};