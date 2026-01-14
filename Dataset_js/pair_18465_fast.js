const Benchmark = {
    run: function() {
        var VAR_1 = { KEY_1: "I am an Object" };
        var VAR_2 = ["I", "am", "an", "Array"];
        function FUNCTION_1(VAR_3) {
          return VAR_3 instanceof Array;
        }
        function FUNCTION_2(VAR_4) {
          return Array.isArray(VAR_4);
        }
        Array.isArray(VAR_2);
        Array.isArray(VAR_1);
    }
};