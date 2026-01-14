const Benchmark = {
    run: function() {
        var VAR_1 = null;
        var VAR_2 = null;
        var VAR_3 = [null];
        function FUNCTION_1(VAR_4) {
          VAR_2 = VAR_1;
          VAR_1 = VAR_4;
        }
        function FUNCTION_2() {
          VAR_1 = VAR_2;
          VAR_2 = null;
        }
        function FUNCTION_6() {
          return VAR_1;
        }
        function FUNCTION_5() {
          return VAR_3[VAR_3.length - 1];
        }
        FUNCTION_6();
    }
};