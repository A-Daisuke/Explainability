const Benchmark = {
    run: function() {
        var VAR_2 = [[], "", 9, true, {}],
          VAR_3,
          VAR_4;
        var VAR_5, VAR_6, VAR_7;
        for (VAR_3 = 0; VAR_3 < VAR_2.length; VAR_3 += 1) {
          if (typeof VAR_2[VAR_3] === "string") {
            VAR_4 = "string";
          } else if (typeof VAR_2[VAR_3] === "number") {
            VAR_4 = "number";
          } else if (typeof VAR_2[VAR_3] === "object") {
            VAR_4 = "object";
          } else if (typeof VAR_2[VAR_3] === "boolean") {
            VAR_4 = "numer";
          } else {
            VAR_4 = "unknown";
          }
        }
    }
};