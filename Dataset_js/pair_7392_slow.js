const Benchmark = {
    run: function() {
        var VAR_1 = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ];
        var VAR_2 = 2;
        const VAR_3 = [];
        for (let VAR_4 = 0, VAR_5 = VAR_1.length; VAR_4 < VAR_5; VAR_4++) {
          const VAR_6 = VAR_3[VAR_3.length - 1];
          if (!VAR_6 || VAR_6.length === VAR_2) {
            VAR_3.push([VAR_1[VAR_4]]);
          } else {
            VAR_6.push(VAR_1[VAR_4]);
          }
        }
    }
};