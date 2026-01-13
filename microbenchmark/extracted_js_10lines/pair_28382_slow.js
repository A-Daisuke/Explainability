const Benchmark = {
    run: function() {
        var VAR_1 = [
          "Banana",
          "Orange",
          "Apple",
          "Mango",
          "Peach",
          "Lemon",
          "Pineapple",
          "Plum",
          "Carrot",
        ];
        var VAR_2 = 0;
        while (VAR_1[VAR_2]) {
          if (VAR_1[VAR_2] === "Plum") {
            break;
          }
          VAR_2++;
        }
    }
};