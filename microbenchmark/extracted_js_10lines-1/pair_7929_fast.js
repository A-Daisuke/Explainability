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
        const VAR_2 = Object.entries(VAR_1).reduce((VAR_3, VAR_4, VAR_5, VAR_6) => {
          VAR_4[0] = +VAR_4[0];
          return VAR_6;
        }, 0);
    }
};