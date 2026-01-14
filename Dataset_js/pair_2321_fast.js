const Benchmark = {
    run: function() {
        (function () {
          var VAR_1 = {
            KEY_1: "",
            KEY_2: function (VAR_3) {
              this.KEY_1 += VAR_3;
            },
          };
          for (var VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
            VAR_1.KEY_2("Quick ");
            VAR_1.KEY_2(VAR_2);
            VAR_1.KEY_2(" fox ");
            VAR_1.KEY_2(VAR_2);
            VAR_1.KEY_2(" over the ");
            VAR_1.KEY_2(VAR_2);
            VAR_1.KEY_2(" dog. ");
          }
        })();
    }
};