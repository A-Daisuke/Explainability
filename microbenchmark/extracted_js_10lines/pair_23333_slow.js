const Benchmark = {
    run: function() {
        var VAR_1 = 5;
        var VAR_2 = 0;
        var VAR_3 = new Array();
        function FUNCTION_1(VAR_4) {
          if (VAR_1 < 2) {
            return 1;
          } else {
            return FUNCTION_1(VAR_1 - 2) + FUNCTION_1(VAR_1 - 1);
          }
        }
    }
};