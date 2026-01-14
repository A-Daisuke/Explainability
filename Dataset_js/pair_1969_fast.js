const Benchmark = {
    run: function() {
        const VAR_1 = [];
        for (let VAR_2 = 0; VAR_2 < 1000; ++VAR_2) {
          VAR_1.push(VAR_2);
        }
        let VAR_3 = VAR_1.reduce((VAR_5, VAR_4) => {
          switch (VAR_4 % 3) {
            case 0:
              VAR_5.push("fizz");
              break;
            case 1:
              break;
            case 2:
              VAR_5.push(VAR_4 - 2);
              VAR_5.push(VAR_4 - 1);
              break;
          }
          return VAR_5;
        }, []);
    }
};