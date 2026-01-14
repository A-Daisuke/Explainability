const Benchmark = {
    run: function() {
        var VAR_1 = [
          null,
          undefined,
          false,
          true,
          -1,
          0,
          1,
          2,
          3,
          4,
          "",
          "foo",
          [],
          {},
        ];
        for (var VAR_2 = 0; VAR_2 < VAR_1.length; VAR_2++) {
          ~~!!VAR_1[VAR_2];
        }
    }
};