const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "1",
          KEY_2: "2",
          KEY_3: {
            KEY_4: "1",
            KEY_5: "2",
            KEY_6: {
              KEY_7: 1,
              KEY_8: 2,
            },
          },
        };
        var VAR_2 = [],
          VAR_3 = 0;
        for (; VAR_3 < 2; VAR_3++) {
          VAR_2.push(VAR_1);
        }
        var VAR_4 = 0,
          VAR_5;
        for (; VAR_3 < 100; VAR_3++) {
          if (VAR_2[0]) {
            VAR_5 = 1 + 1;
          }
        }
    }
};