const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (VAR_1 <= 1) {
            return [1];
          }
          var VAR_2 = FUNCTION_1(VAR_1 - 1),
            VAR_3 = VAR_2.slice(-VAR_1 + 1);
          return VAR_2.concat(
            1,
            VAR_3.slice(1).map(function (VAR_4, VAR_5) {
              return VAR_4 + VAR_3[VAR_5];
            }),
            1,
          );
        }
        console.log(FUNCTION_1(100));
    }
};