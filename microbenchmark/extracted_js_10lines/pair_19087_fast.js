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
        "abcdef"[0] === "a";
        "abcdef"[0] === "b";
    }
};