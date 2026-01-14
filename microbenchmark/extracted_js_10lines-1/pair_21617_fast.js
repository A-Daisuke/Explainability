const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: function () {},
          KEY_2: function () {},
          KEY_3: function () {},
          KEY_10: function (VAR_3, VAR_4, VAR_5) {
            this.VAR_6 = VAR_3;
            this.VAR_7 = VAR_4;
            this.VAR_8 = VAR_5;
            return this;
          },
        };
        VAR_1.KEY_10(777, "str", {});
    }
};