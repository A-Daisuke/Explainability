const Benchmark = {
    run: function() {
        var VAR_1 = {
            KEY_1: true,
            KEY_2: 1,
            KEY_3: "a",
            KEY_4: [],
            KEY_5: {},
            KEY_6: new String(),
            KEY_7: false,
            KEY_8: 0,
            KEY_9: "",
            KEY_10: null,
            KEY_11: undefined,
          },
          VAR_2 = 0,
          VAR_3 = [];
        for (VAR_2 = 97; VAR_2 < 123; ++VAR_2) {
          VAR_3.push(String.fromCharCode(VAR_2));
        }
        VAR_2 = 0;
        VAR_3.forEach(function (VAR_4) {
          if (VAR_1[VAR_4]) {
            VAR_2++;
          }
        });
    }
};