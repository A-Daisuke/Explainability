const Benchmark = {
    run: function() {
        const FUNCTION_1 = (VAR_1, VAR_2) => {
          const FUNCTION_2 = (VAR_3, VAR_4, VAR_5) => {
            if (!VAR_1(VAR_4)) return VAR_5;
            const [VAR_6, VAR_7] = VAR_1(VAR_4);
            VAR_5.push(VAR_6);
            return FUNCTION_2(VAR_1, VAR_7, VAR_5);
          };
          return FUNCTION_2(VAR_1, VAR_2, []);
        };
        const FUNCTION_3 = (VAR_8, VAR_9) =>
          FUNCTION_1((VAR_10) => (VAR_10 <= VAR_9 ? [VAR_10, VAR_10 + 1] : null), VAR_8);
        const VAR_11 = 0;
        const VAR_12 = 5000;
        FUNCTION_3(VAR_11, VAR_12);
    }
};