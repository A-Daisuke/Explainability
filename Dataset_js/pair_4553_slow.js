const Benchmark = {
    run: function() {
        let VAR_1 = [];
        let VAR_2 = [];
        for (let VAR_3 = 0; VAR_3 < 100; ++VAR_3) {
          VAR_1.push(VAR_3);
          VAR_2.push(VAR_3);
        }
        let VAR_4 = 0;
        let VAR_5 = 0;
        let VAR_6 = 0;
        while (VAR_6 < VAR_2.length && VAR_5 < VAR_1.length) {
          const VAR_7 = VAR_5;
          const VAR_8 = VAR_6;
          if (++VAR_6 == VAR_2.length) {
            VAR_6 = 0;
            ++VAR_5;
          }
          VAR_4 += VAR_1[VAR_7] + VAR_2[VAR_8];
        }
    }
};