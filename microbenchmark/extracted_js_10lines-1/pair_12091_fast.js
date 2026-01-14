const Benchmark = {
    run: function() {
        var VAR_1 = [
          "a",
          1,
          2,
          3,
          0,
          5,
          6,
          7,
          4,
          9,
          "b",
          "c",
          "d",
          "e",
          "burrito",
          "g",
          123,
        ];
        var VAR_2;
        VAR_2 = VAR_1.indexOf("b");
        if (VAR_2 != -1) {
          VAR_1.splice(VAR_2, 1);
        }
    }
};