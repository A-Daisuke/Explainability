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
        var VAR_2 = [];
        VAR_1.forEach(function (VAR_3) {
          VAR_3.forEach(function (VAR_4) {
            VAR_2.push(VAR_4);
          });
        });
    }
};