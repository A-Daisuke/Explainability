const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_3) {
          if (VAR_3.length === 2) {
            return [VAR_3.slice(), VAR_3.slice().reverse()];
          }
          return [].concat.apply(
            [],
            VAR_3.map(function (VAR_8, VAR_9, VAR_10) {
              var VAR_11 = VAR_10.slice();
              var VAR_12 = VAR_11.splice(VAR_9, 1);
              return FUNCTION_1(VAR_11).map(function (VAR_13) {
                return VAR_12.concat(VAR_13);
              });
            }),
          );
        }
        FUNCTION_1([1, 2, 3, 4]);
    }
};