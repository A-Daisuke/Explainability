const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2, VAR_3, VAR_4) {
          VAR_3 = typeof VAR_3 !== "undefined" ? VAR_3 : 0;
          VAR_4 = typeof VAR_4 !== "undefined" ? VAR_4 : VAR_1.length;
          var VAR_5 = 0;
          while (VAR_3 != VAR_4) {
            if (VAR_1[VAR_3] == VAR_2) {
              ++VAR_5;
            }
            ++VAR_3;
          }
          return VAR_5;
        }
        function FUNCTION_2() {
          return new Array(10000).join(Math.random().toString(36) + "\n");
        }
        FUNCTION_1(FUNCTION_2(), "\n");
    }
};