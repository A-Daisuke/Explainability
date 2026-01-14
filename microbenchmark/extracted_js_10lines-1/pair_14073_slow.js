const Benchmark = {
    run: function() {
        var VAR_1 = "_ready_AaaAaaAaaA";
        function FUNCTION_1() {
          return VAR_1.split("_ready_").length;
        }
        function FUNCTION_2() {
          return VAR_1.indexOf("_ready_") > -1;
        }
        function FUNCTION_3() {
          return VAR_1.match("_ready_");
        }
        FUNCTION_3();
    }
};