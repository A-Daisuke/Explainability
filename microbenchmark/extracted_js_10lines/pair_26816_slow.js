const Benchmark = {
    run: function() {
        var VAR_1 = 0;
        var VAR_2 = 1 / 3;
        var VAR_3, VAR_4;
        var VAR_5 = new Int8Array(1);
        Object.defineProperty(VAR_5, "v", {
          KEY_1: function () {
            return this[0];
          },
          KEY_2: function (VAR_6) {
            this[0] = VAR_6;
          },
        });
        VAR_5.VAR_7 = (VAR_5.VAR_7 + VAR_1) / 2;
        VAR_1 += VAR_2;
    }
};