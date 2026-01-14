const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          if (VAR_2) {
            return FUNCTION_2(VAR_1);
          }
          return FUNCTION_3;
          function FUNCTION_3() {
            return VAR_1;
          }
        }
        function FUNCTION_2(VAR_3) {
          return FUNCTION_4;
          function FUNCTION_4() {
            if (VAR_3) {
              return FUNCTION_5();
            } else {
              return FUNCTION_6();
            }
            function FUNCTION_5() {}
            function FUNCTION_6() {}
          }
        }
        for (var VAR_4 = 0; VAR_4 < 1000; VAR_4++) {
          if (VAR_4 % 10 === 0) {
            FUNCTION_1({}, true);
          } else {
            FUNCTION_1({});
          }
        }
    }
};