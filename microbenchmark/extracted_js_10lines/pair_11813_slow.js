const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = {};
          Object.defineProperty(VAR_2, "z", {
            KEY_1: function () {
              return VAR_1;
            },
          });
          return VAR_2;
        }
        function FUNCTION_2(VAR_3) {
          return {
            KEY_2: function () {
              return VAR_3;
            },
          };
        }
        FUNCTION_1(5).KEY_2 == 5;
    }
};