const Benchmark = {
    run: function() {
        let VAR_1 = [];
        for (let VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
          VAR_1.push({
            KEY_1: VAR_2 / 100,
            KEY_2: Math.random(),
          });
        }
        let VAR_3 = VAR_1.slice();
        while (VAR_3[0].KEY_1 < 5) VAR_3.shift();
        if (VAR_3.length !== 500) throw new Error();
    }
};