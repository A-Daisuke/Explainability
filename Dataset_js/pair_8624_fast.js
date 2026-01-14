const Benchmark = {
    run: function() {
        const VAR_1 = { KEY_1: 0 };
        let VAR_9 = 0;
        const VAR_10 = {
          KEY_6() {
            return VAR_9;
          },
          KEY_7(VAR_11) {
            return (VAR_9 = VAR_11);
          },
        };
        const VAR_2 = new Proxy({ KEY_2: 0 }, {});
        VAR_10.KEY_1;
    }
};