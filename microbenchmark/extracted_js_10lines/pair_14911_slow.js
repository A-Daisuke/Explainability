const Benchmark = {
    run: function() {
        var VAR_1 = [
            {
              KEY_1: 1,
              KEY_2: true,
            },
            {
              KEY_3: 2,
              KEY_4: true,
            },
            {
              KEY_5: 3,
              KEY_6: false,
            },
            {
              KEY_7: 4,
              KEY_8: true,
            },
            {
              KEY_9: 5,
              KEY_10: false,
            },
          ],
          VAR_2 = [],
          VAR_3 = VAR_1.length,
          VAR_4,
          VAR_5 = 0;
        Array.prototype.FUNCTION_1 = function (VAR_6) {
          return;
        };
        for (VAR_5; VAR_5 < VAR_3; VAR_5++) {
          VAR_4 = VAR_1[VAR_5];
          if (VAR_4.KEY_2) VAR_2.push(VAR_4);
        }
    }
};