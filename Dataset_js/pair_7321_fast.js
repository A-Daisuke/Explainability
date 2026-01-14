const Benchmark = {
    run: function() {
        const VAR_1 = {
          "A+": [95, 100],
          KEY_1: [90, 94],
          "B+": [85, 90],
          KEY_2: [75, 85],
          KEY_3: [60, 74],
          KEY_4: [0, 59],
        };
        function FUNCTION_1(VAR_2, VAR_3, VAR_4) {
          for (let VAR_10 in VAR_2) {
            const VAR_11 = VAR_10;
            const [VAR_5, VAR_6] = VAR_2[VAR_11];
            if (VAR_4(VAR_3, VAR_5, VAR_6)) {
              return VAR_11;
            }
          }
        }
        FUNCTION_1(VAR_1, 75, (VAR_7, VAR_8, VAR_9) =>
          VAR_9 === undefined || VAR_9 === null ? VAR_7 >= VAR_8 : VAR_7 >= VAR_8 && VAR_7 <= VAR_9,
        );
    }
};