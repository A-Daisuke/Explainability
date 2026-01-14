const Benchmark = {
    run: function() {
        const VAR_1 = "veryLongPrefixForGeneratedKeys";
        let VAR_2 = [];
        for (let VAR_3 = 0; VAR_3 < 50000; VAR_3++) {
          VAR_2.push({
            KEY_1: `${VAR_1}${VAR_3}`,
            KEY_2: VAR_3,
          });
        }
        let VAR_4 = {};
        let VAR_5 = new Map();
        VAR_2.forEach((VAR_6) => {
          VAR_4[VAR_6.KEY_1] = VAR_6;
          VAR_5.set(VAR_6.KEY_1, VAR_6);
        });
        VAR_5.get("veryLongPrefixForGeneratedKeys1000");
    }
};