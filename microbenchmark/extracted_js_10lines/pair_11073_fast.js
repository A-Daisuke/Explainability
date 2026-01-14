const Benchmark = {
    run: function() {
        var VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 100; VAR_2++) {
          VAR_1.push({ KEY_1: VAR_2 });
        }
        var VAR_3 = Math.round(Math.random() * VAR_1.length);
        for (var VAR_5 = 0; VAR_2 < VAR_1.length; VAR_2++) {
          if (VAR_3 === VAR_1[VAR_2].KEY_1) {
            VAR_1.slice(VAR_2, 0);
            break;
          }
        }
    }
};