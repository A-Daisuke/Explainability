const Benchmark = {
    run: function() {
        let VAR_1 = 0;
        const VAR_2 = {
          KEY_1() {
            return VAR_1;
          },
          KEY_2(VAR_3) {
            return (VAR_1 = VAR_3);
          },
        };
        const VAR_4 = new Proxy({ KEY_3: 0 }, {});
        const VAR_5 = new Proxy(
          { KEY_4: 0 },
          {
            KEY_5(VAR_6, VAR_7) {
              return Reflect.KEY_1(VAR_6, VAR_7);
            },
            KEY_6(VAR_8, VAR_9, VAR_10) {
              return Reflect.KEY_2(VAR_6, VAR_7, VAR_3);
            },
          },
        );
        VAR_4.KEY_3 = Math.random();
    }
};