const Benchmark = {
    run: function() {
        function FUNCTION_2(VAR_3) {
          return {
            KEY_2: function () {
              return VAR_3;
            },
          };
        }
        function FUNCTION_1(VAR_1) {
          return { KEY_3: VAR_1 };
        }
        FUNCTION_1(5).KEY_2 == 5;
    }
};