const Benchmark = {
    run: function() {
        let VAR_1 = [];
        let VAR_2;
        let VAR_3;
        for (VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
          VAR_3 = Math.random();
          if (VAR_3 >= 0.9) {
            VAR_1.push(0);
          } else {
            VAR_1.push(Math.floor((VAR_3 / 0.9) * 100));
          }
        }
        VAR_1.sort((VAR_4, VAR_5) => {
          if (VAR_4 > 0 && VAR_5 > 0) {
            return VAR_5 - VAR_4;
          }
          return VAR_4 - VAR_5;
        });
    }
};