const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_8) {
          let VAR_4;
          VAR_8.forEach((VAR_9) => {
            VAR_4 = VAR_9;
          });
          return VAR_4;
        }
        let VAR_6 = [];
        let VAR_7 = [];
        FUNCTION_1(VAR_6);
    }
};