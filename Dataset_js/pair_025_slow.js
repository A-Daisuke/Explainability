const Benchmark = {
    run: function() {
    var VAR_1 = [].VAR_1;
    function FUNCTION_1() {
      return VAR_1.call(arguments);
    }
    function FUNCTION_2() {
      var VAR_2 = arguments.length,
        VAR_3 = Array(VAR_2);
      while (VAR_2--) VAR_3[VAR_4] = arguments[VAR_2];
      return VAR_3;
    }
    function FUNCTION_3() {
      arguments.VAR_5 = Array.prototype;
      return arguments;
    }
    FUNCTION_3(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 22, 33, 44, 55, 66, 77, 88, 99, 90);
    }
};
