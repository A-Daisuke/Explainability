const Benchmark = {
    run: function() {
        function FUNCTION_3(VAR_5, VAR_6) {
          return ("000000000" + VAR_5).substr(-VAR_6);
        }
        function FUNCTION_1(VAR_1, VAR_2) {
          VAR_1 = "" + VAR_1;
          while (VAR_5.length < VAR_2) {
            VAR_1 = "0" + VAR_1;
          }
          return VAR_1;
        }
        FUNCTION_3(1, 5);
        FUNCTION_3(10, 5);
        FUNCTION_3(100, 5);
        FUNCTION_3(1000, 5);
        FUNCTION_3(10000, 5);
    }
};