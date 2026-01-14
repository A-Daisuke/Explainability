const Benchmark = {
    run: function() {
        var VAR_1 = " ",
          VAR_2 = 4,
          VAR_3 = "4",
          VAR_4,
          VAR_6 = {
            KEY_1: "BBBB",
            KEY_2: "BBBBBBB",
            KEY_3: "BBBBBBBBBB",
            KEY_4: "BBB",
            " ": "BBBB",
          },
          VAR_5 = {
            0: "BBBB",
            1: "BBBBBBB",
            2: "BBBBBBBBBB",
            3: "BBB",
            4: "BBBB",
          };
        VAR_4 = VAR_6[VAR_1];
    }
};