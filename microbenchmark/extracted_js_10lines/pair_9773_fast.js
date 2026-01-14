const Benchmark = {
    run: function() {
        var VAR_1 = [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          {},
        ];
        var VAR_2 = 0,
          VAR_3,
          VAR_4;
        for (var VAR_5 = 0, VAR_6 = VAR_1.length; VAR_5 < VAR_6; ++VAR_5) {
          VAR_4 = VAR_1[VAR_5];
          if (typeof VAR_4 === "number") {
            VAR_2 = VAR_4;
          }
        }
    }
};