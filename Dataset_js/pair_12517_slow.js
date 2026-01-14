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
        function FUNCTION_3(VAR_5) {
          VAR_3.push(VAR_5);
        }
        function FUNCTION_4() {
          VAR_3.pop();
        }
        function FUNCTION_5() {
          return VAR_3[VAR_3.length - 1];
        }
        FUNCTION_3("apple");
        FUNCTION_3("banana");
        FUNCTION_4();
        FUNCTION_4();
    }
};