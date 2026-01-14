const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: function () {},
          KEY_2: function () {
            this.KEY_1();
          },
          KEY_3: function () {
            this.KEY_1.bind(this)();
          },
          KEY_4: function () {
            var VAR_2 = this;
            (function () {
              VAR_2.KEY_1();
            })();
          },
        };
        VAR_1.KEY_3();
    }
};