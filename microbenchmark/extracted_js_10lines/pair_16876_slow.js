const Benchmark = {
    run: function() {
        const VAR_1 = {
          KEY_1: "value",
          KEY_2: function m() {
            return this;
          },
        };
        const VAR_2 = new Proxy(VAR_1, {
          KEY_3: function _get(VAR_3, VAR_4, VAR_5) {
            return VAR_3[VAR_4];
          },
        });
        VAR_1.VAR_6 = new Proxy(VAR_1.KEY_2, {
          KEY_4: function _apply(VAR_7, VAR_8, VAR_9) {
            return VAR_3.KEY_4(VAR_8, VAR_9);
          },
        });
        VAR_2.KEY_2();
    }
};