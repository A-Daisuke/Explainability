const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: function (VAR_2) {
            var VAR_7 = VAR_2[0],
              VAR_8 = 1,
              VAR_4 = VAR_2.length,
              VAR_9 = [VAR_7],
              VAR_3 = [];
            for (; VAR_8 < VAR_4; ++VAR_8) {
              if (VAR_2[VAR_8] === VAR_7) VAR_9.push(VAR_7);
              else {
                VAR_3.push(VAR_9);
                VAR_9 = [];
                VAR_7 = VAR_2[VAR_8];
                VAR_9.push(VAR_7);
              }
            }
            VAR_3.push(VAR_9);
            return VAR_3;
          },
        };
        var VAR_6 = [
          "a",
          "a",
          "a",
          "a",
          "b",
          "c",
          "c",
          "a",
          "a",
          "d",
          "e",
          "e",
          "e",
          "e",
        ];
        VAR_1.KEY_1(VAR_6);
    }
};