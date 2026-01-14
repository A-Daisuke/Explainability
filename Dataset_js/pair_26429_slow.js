const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          return new Array(VAR_1 + 1).join(VAR_2);
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          var VAR_5 = "";
          for (var VAR_6 = 0; VAR_6 < VAR_3; VAR_6++) {
            VAR_5 += VAR_4;
          }
          return VAR_5;
        }
        function FUNCTION_3(VAR_7, VAR_8) {
          if (VAR_7 <= 1) return VAR_8;
          return VAR_8 + FUNCTION_3(VAR_7 - 1, VAR_8);
        }
        FUNCTION_3(4, "Hello world");
    }
};