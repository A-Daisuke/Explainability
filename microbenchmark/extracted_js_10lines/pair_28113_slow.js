const Benchmark = {
    run: function() {
        var VAR_1 = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
        ];
        var VAR_2 = VAR_1;
        for (var VAR_3 = VAR_2.length, VAR_4; VAR_3; ) {
          VAR_4 = VAR_2[VAR_3--];
        }
    }
};