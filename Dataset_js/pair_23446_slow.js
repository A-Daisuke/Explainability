const Benchmark = {
    run: function() {
        var VAR_1 = [
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
        ];
        var VAR_2 = Object.freeze([
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
        var VAR_3 = 0;
        var VAR_4;
        for (VAR_3; VAR_3 < VAR_1.length; VAR_3++) {
          VAR_4 = VAR_1[VAR_3];
        }
    }
};