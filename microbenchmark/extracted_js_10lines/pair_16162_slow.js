const Benchmark = {
    run: function() {
        VAR_1 = "hello";
        VAR_2 = {
          KEY_1: "a",
          KEY_2: "b",
          KEY_3: 12345,
          KEY_4: 12,
          KEY_5: VAR_1,
        };
        Object.keys(VAR_2).forEach(function (VAR_3) {
          "s" + "s";
        }, VAR_2);
    }
};