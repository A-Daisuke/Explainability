const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 23424,
          KEY_2: 123123,
          KEY_3: 234234,
        };
        var VAR_2 = {
          KEY_4: 23424,
          KEY_5: 123123,
          KEY_6: 234234,
        };
        var VAR_3 = 1;
        for (var VAR_4 = 0; VAR_4 < 10000; VAR_4++) {
          if (JSON.stringify(VAR_1) === JSON.stringify(VAR_1)) {
            VAR_3++;
          }
        }
    }
};