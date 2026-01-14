const Benchmark = {
    run: function() {
        if (!String.prototype.startsWith) {
          Object.defineProperty(String.prototype, "startsWith", {
            KEY_1: false,
            KEY_2: false,
            KEY_3: false,
            KEY_4: function (VAR_1, VAR_2) {
              VAR_2 = VAR_2 || 0;
              return this.indexOf(VAR_1, VAR_2) === VAR_2;
            },
          });
        }
        var VAR_3 = /^a/;
        var VAR_4 = /^b/;
        "abcdef".indexOf("a") === 0;
        "abcdef".indexOf("b") === 0;
    }
};