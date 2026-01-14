const Benchmark = {
    run: function() {
        var VAR_1 = [
          "z",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
        ];
        var VAR_2, VAR_3;
        for (VAR_2 in VAR_1) {
          VAR_3 = VAR_1[VAR_2];
        }
    }
};