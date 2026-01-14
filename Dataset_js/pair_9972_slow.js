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
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
        ];
        var VAR_2 = -1;
        for (var VAR_3 = 0; VAR_3 < VAR_1.length; VAR_3++) {
          if (VAR_1[VAR_3] == "t") VAR_2 = VAR_3;
        }
    }
};