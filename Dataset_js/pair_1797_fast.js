const Benchmark = {
    run: function() {
        const FUNCTION_2 = (VAR_3, VAR_4) => {
          const VAR_13 = [];
          for (let VAR_14 = VAR_3; VAR_14 <= VAR_4; VAR_14 += 1) {
            VAR_13.push(VAR_14);
          }
          return VAR_13;
        };
        const VAR_11 = 0;
        const VAR_12 = 5000;
        FUNCTION_2(VAR_11, VAR_12);
    }
};