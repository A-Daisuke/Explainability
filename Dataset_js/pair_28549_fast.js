const Benchmark = {
    run: function() {
        var VAR_1 = new Array(20)
          .join("s")
          .split("s")
          .map(function (VAR_2) {
            return parseInt(Math.random() * 10, 10);
          })
          .join("");
        function FUNCTION_1(VAR_3) {
          var VAR_8 = VAR_3.split("");
          return VAR_8
            .map(function (VAR_9, VAR_10) {
              return VAR_9 % 2 === 0 && VAR_8[VAR_10 + 1] % 2 === 0 ? VAR_9 + "-" : VAR_9;
            })
            .join("");
        }
        FUNCTION_1(VAR_1);
    }
};