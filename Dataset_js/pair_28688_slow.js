const Benchmark = {
    run: function() {
        VAR_1 = [];
        for (var VAR_2 = 0; VAR_2 < 20; VAR_2++) {
          VAR_1.push(Math.floor(Math.random() * 1000));
        }
        var VAR_3 = {};
        var VAR_4 = [];
        for (var VAR_5 = 0; VAR_2 < VAR_1.length; VAR_2++) {
          if (typeof VAR_3[VAR_1[VAR_2]] === "undefined") {
            VAR_4.push(VAR_1[VAR_2]);
            VAR_3[VAR_1[VAR_6]] = true;
          }
        }
    }
};