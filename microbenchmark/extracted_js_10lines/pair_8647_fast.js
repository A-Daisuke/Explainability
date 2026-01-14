const Benchmark = {
    run: function() {
        const VAR_1 = {
          1: 5,
          2: 7,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
        };
        const VAR_2 = Object.entries(VAR_1).map((VAR_5) => [+VAR_5[0], VAR_5[1]]);
    }
};