const Benchmark = {
    run: function() {
        let VAR_1 = [];
        let VAR_2 = [];
        for (let VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1.push(VAR_3);
          VAR_2.push(VAR_3);
        }
        let VAR_4 = 0;
        for (let VAR_9 = 0; VAR_9 < VAR_1.length; ++VAR_9) {
          for (let VAR_10 = 0; VAR_10 < VAR_2.length; ++VAR_10) {
            VAR_4 += VAR_1[VAR_9] + VAR_2[VAR_10];
          }
        }
    }
};