const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: function (VAR_2) {
            var VAR_3 = [],
              VAR_4 = VAR_2.length,
              VAR_5 = 0;
            for (; VAR_5 < VAR_4; VAR_5++) {
              if (VAR_5 > 0 && VAR_2[VAR_5] === VAR_2[VAR_5 - 1])
                VAR_3[VAR_3.length - 1].push(VAR_2[VAR_5]);
              else if (VAR_5 === 0 || VAR_2[VAR_5] !== VAR_2[VAR_5 - 1]) VAR_3.push([VAR_2[VAR_5]]);
            }
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