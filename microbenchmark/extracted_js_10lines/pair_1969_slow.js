const Benchmark = {
    run: function() {
        const VAR_1 = [];
        for (let VAR_2 = 0; VAR_2 < 1000; ++VAR_2) {
          VAR_1.push(VAR_2);
        }
        let VAR_3 = VAR_1
          .map((VAR_4) => {
            switch (VAR_4 % 3) {
              case 0:
                return ["fizz"];
              case 1:
                return [];
              case 2:
                return [VAR_4 - 2, VAR_4 - 1];
            }
          })
          .flat();
    }
};