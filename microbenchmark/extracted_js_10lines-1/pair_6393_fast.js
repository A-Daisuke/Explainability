const Benchmark = {
    run: function() {
        var VAR_1 = "";
        var VAR_4 = [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
        ];
        var VAR_5 = 0,
          VAR_6 = VAR_4.length;
        while (VAR_5 < VAR_6) {
          VAR_1 += VAR_4[VAR_5];
          VAR_5++;
        }
    }
};