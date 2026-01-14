const Benchmark = {
    run: function() {
        const VAR_1 = { KEY_1: 0 };
        const VAR_2 = new Proxy({ KEY_2: 0 }, {});
        const VAR_3 = new Proxy(
          { KEY_3: 0 },
          {
            KEY_4(VAR_4, VAR_5) {
              return Reflect.KEY_4(VAR_4, VAR_5);
            },
            KEY_5(VAR_6, VAR_7, VAR_8) {
              return Reflect.KEY_5(VAR_4, VAR_5, VAR_8);
            },
          },
        );
        VAR_3.KEY_1 = Math.random();
    }
};