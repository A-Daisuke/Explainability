const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return Object.prototype.toString.call(VAR_1) == "[object String]";
        }
        function FUNCTION_2(VAR_2) {
          return VAR_1.constructor === String;
        }
        FUNCTION_1("");
        FUNCTION_1("");
        FUNCTION_1(new String());
        FUNCTION_1({});
        FUNCTION_1(false);
    }
};