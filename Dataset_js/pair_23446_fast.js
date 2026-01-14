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
        VAR_1.forEach(function () {});
    }
};