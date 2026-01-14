const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = 0;
        for (var VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1.push(String.fromCharCode(Math.floor(Math.random() * 5) + 65));
        }
        for (VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_2 = 0;
          if (VAR_1[VAR_3] == "A") {
            VAR_2 = 1;
          }
          if (VAR_1[VAR_3] == "B") {
            VAR_2 = 2;
          }
          if (VAR_1[VAR_3] == "C") {
            VAR_2 = 3;
          }
          if (VAR_1[VAR_3] == "D") {
            VAR_2 = 4;
          }
          if (VAR_2 == 0) {
            VAR_2 = 5;
          }
        }
    }
};