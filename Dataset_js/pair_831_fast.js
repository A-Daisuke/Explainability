const Benchmark = {
    run: function() {
        function FUNCTION_2(VAR_6) {
          return VAR_6
            .map(function (VAR_7, VAR_8) {
              return VAR_8 ? VAR_7 + VAR_6[VAR_8 - 1] : 1;
            })
            .concat([1]);
        }
        function FUNCTION_3(VAR_9) {
          var VAR_10 = [],
            VAR_11 = [];
          while (VAR_9--) VAR_11 = VAR_11.concat((VAR_10 = FUNCTION_2(VAR_10)));
          return VAR_11;
        }
        console.log(FUNCTION_3(100));
    }
};