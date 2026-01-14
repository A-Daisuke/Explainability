const Benchmark = {
    run: function() {
        var VAR_1 = [
          [
            {
              KEY_1: "fddf",
              KEY_2: "dfg",
            },
            {
              KEY_3: "fdfdf",
              KEY_4: "dffg",
            },
          ],
          [
            {
              KEY_5: "fdfdf",
              KEY_6: "dffsfg",
            },
          ],
          [
            {
              KEY_7: "hggj",
              KEY_8: "hbj",
            },
            {
              KEY_9: "fddf",
              KEY_10: "dfg",
            },
          ],
        ];
        var FUNCTION_1 = function (VAR_5) {
          return [].concat.apply([], VAR_1);
        };
        FUNCTION_1(VAR_1);
    }
};