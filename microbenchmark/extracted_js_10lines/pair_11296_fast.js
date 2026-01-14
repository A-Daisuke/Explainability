const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "somestring",
          KEY_2: 42,
          KEY_3: false,
        };
        for (var VAR_4 in VAR_1) {
          if (VAR_1.hasOwnProperty(VAR_4)) {
            if (VAR_4 == "a") VAR_1[VAR_5] = null;
          }
        }
    }
};