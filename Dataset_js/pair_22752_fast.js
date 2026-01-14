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
          10,
          "asdf",
          "asdfg",
          "asdfghj",
          "asdfghjk",
        ];
        var VAR_3 = VAR_1.length;
        for (var VAR_2 = 0; VAR_2 < VAR_3; VAR_2++) {}
    }
};