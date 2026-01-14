const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          if (!Array.isArray(VAR_1)) {
            VAR_1 = [VAR_1];
          }
          return VAR_1;
        }
        for (var VAR_2 = 0; VAR_2 < 1000; VAR_2++) {
          if (VAR_2 % 2 === 0) {
            FUNCTION_1(["a"]);
          } else {
            FUNCTION_1("a");
          }
        }
    }
};