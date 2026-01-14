const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          VAR_1 = "" + VAR_1;
          while (VAR_1.length < VAR_2) {
            VAR_1 = "0" + VAR_1;
          }
          return VAR_1;
        }
        function FUNCTION_2(VAR_3, VAR_4) {
          function FUNCTION_3(VAR_5, VAR_6) {
            return ("000000000" + VAR_3).substr(-VAR_4);
          }
          return FUNCTION_3(VAR_3, VAR_4);
        }
        FUNCTION_2(1, 5);
        FUNCTION_2(10, 5);
        FUNCTION_2(100, 5);
        FUNCTION_2(1000, 5);
        FUNCTION_2(10000, 5);
    }
};