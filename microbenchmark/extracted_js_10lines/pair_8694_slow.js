const Benchmark = {
    run: function() {
        VAR_1 = [
          null,
          undefined,
          1,
          "stringstringstring",
          {},
          {
            KEY_1: "bar",
            KEY_2: "bing",
          },
        ];
        VAR_2 = [
          {},
          {
            KEY_3: "bar",
            KEY_4: "bing",
          },
        ];
        VAR_1.forEach(function (VAR_3) {
          JSON.stringify(VAR_3);
        });
    }
};