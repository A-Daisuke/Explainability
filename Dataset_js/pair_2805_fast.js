const Benchmark = {
    run: function() {
        function FUNCTION_2(VAR_9, VAR_10) {
          return VAR_10 ? FUNCTION_2(VAR_10, ((VAR_9 % VAR_10) + VAR_10) % VAR_10) : VAR_9;
        }
        function FUNCTION_3(VAR_11, VAR_12) {
          var VAR_13 = VAR_12.reduce(function (VAR_14, VAR_15) {
            return (VAR_14 * VAR_15) / FUNCTION_2(VAR_14, VAR_15);
          });
          VAR_11 = Math.floor(VAR_11 / VAR_13);
          return VAR_13 * 0.5 * VAR_11 * (VAR_11 + 1);
        }
        FUNCTION_3(1000, [3, 5]);
    }
};