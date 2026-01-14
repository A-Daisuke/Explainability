const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 10,
          KEY_2: function () {
            return 10;
          },
          KEY_3: function () {
            return this.KEY_1;
          },
        };
        var VAR_2 = VAR_1.KEY_1;
    }
};