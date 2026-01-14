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
        VAR_2.forEach(function (VAR_3) {
          if (typeof VAR_3 === "object") {
            JSON.stringify(VAR_3);
          }
        });
    }
};