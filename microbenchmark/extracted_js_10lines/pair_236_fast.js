const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 0,
          KEY_2: function () {
            ++this.KEY_1;
          },
        };
        (function (VAR_2) {
          for (var VAR_3 = 0; VAR_3 < 25; ++VAR_3) {
            for (var VAR_4 = 0; VAR_4 < VAR_2; ++VAR_4) {
              this.KEY_2();
              this.KEY_2();
              this.KEY_2();
              this.KEY_2();
            }
          }
        }).call(VAR_1, +("100" + "000"));
    }
};