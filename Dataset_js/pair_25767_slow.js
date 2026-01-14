const Benchmark = {
    run: function() {
        var VAR_1 = { KEY_1: true };
        var VAR_2 = "foo";
        function FUNCTION_1(VAR_3) {
          return VAR_1[VAR_2];
        }
        function FUNCTION_2(VAR_4) {
          return VAR_1.KEY_1;
        }
        function FUNCTION_3() {
          return FUNCTION_2(VAR_1);
        }
        function FUNCTION_4() {
          return VAR_1.KEY_1;
        }
        function FUNCTION_5() {
          var VAR_5 = "foo";
          return VAR_1[VAR_2];
        }
        FUNCTION_5();
    }
};