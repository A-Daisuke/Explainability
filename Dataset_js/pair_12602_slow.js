const Benchmark = {
    run: function() {
        var VAR_1 = Object.freeze([
          "x",
          "y",
          "z",
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
          "k",
          "l",
        ]);
        var VAR_2 = 0;
        var VAR_3;
        for (VAR_2; VAR_2 < VAR_1.length; VAR_2++) {
          VAR_3 = VAR_1[VAR_2];
        }
    }
};