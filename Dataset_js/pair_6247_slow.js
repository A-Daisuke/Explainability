const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = 0;
        for (var VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1.push(String.fromCharCode(Math.floor(Math.random() * 5) + 65));
        }
        for (VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          switch (VAR_1[VAR_3]) {
            case "A":
              VAR_2 = 1;
              break;
            case "B":
              VAR_2 = 2;
              break;
            case "C":
              VAR_2 = 3;
              break;
            case "D":
              VAR_2 = 4;
              break;
            default:
              VAR_2 = 5;
          }
        }
    }
};