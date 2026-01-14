const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          let VAR_9 = VAR_1.reduce((VAR_10, VAR_11) => VAR_10 + VAR_11, 0);
          const VAR_12 = VAR_1.slice().concat(VAR_9),
            VAR_13 = VAR_1.length;
          while (VAR_12.length < VAR_2) {
            VAR_9 += VAR_9 - (VAR_12[VAR_12.length - VAR_13 - 1] || 0);
            VAR_12.push(VAR_9);
          }
          return VAR_12.slice(0, VAR_2);
        }
        FUNCTION_1([1, 1, 1, 1], 10);
    }
};