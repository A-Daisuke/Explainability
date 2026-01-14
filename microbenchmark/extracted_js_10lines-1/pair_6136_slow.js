const Benchmark = {
    run: function() {
        var VAR_1 = [
          {},
          [],
          "",
          "0",
          "-2",
          "2",
          "-1.3",
          0,
          3,
          -3,
          2 * Math.random(),
          null,
          NaN,
          undefined,
          Infinity,
        ];
        var VAR_2;
        for (var VAR_3 in VAR_1) (VAR_2 *= VAR_2 = VAR_1[VAR_3]) < VAR_2;
    }
};