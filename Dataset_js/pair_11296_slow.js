const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: "somestring",
          KEY_2: 42,
          KEY_3: false,
        };
        JSON.parse(
          JSON.stringify(VAR_1, function (VAR_2, VAR_3) {
            if (VAR_3.KEY_1) return null;
            return VAR_3;
          }),
        );
    }
};