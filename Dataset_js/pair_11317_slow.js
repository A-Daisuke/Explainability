const Benchmark = {
    run: function() {
        var VAR_1 = ["object", "number", "string", "boolean"],
          VAR_2 = [[], "", 9, true, {}],
          VAR_3,
          VAR_4;
        for (VAR_3 = 0; VAR_3 < VAR_2.length; VAR_3 += 1) {
          if (VAR_1.indexOf(typeof VAR_2[VAR_3]) === 0) {
            VAR_4 = "object";
          } else if (VAR_1.indexOf(typeof VAR_2[VAR_3]) === 1) {
            VAR_4 = "number";
          } else if (VAR_1.indexOf(typeof VAR_2[VAR_3]) === 2) {
            VAR_4 = "string";
          } else if (VAR_1.indexOf(typeof VAR_2[VAR_3]) === 3) {
            VAR_4 = "boolean";
          }
        }
    }
};