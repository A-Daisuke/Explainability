const Benchmark = {
    run: function() {
    var FUNCTION_1 = function (VAR_1, VAR_2) {
      VAR_1 = VAR_1 + "";
      if (VAR_2 <= 0) return "";
      if (VAR_2 % 2) return FUNCTION_1(VAR_1, VAR_2 - 1) + VAR_1;
      var VAR_3 = FUNCTION_1(VAR_1, VAR_2 / 2);
      return VAR_3 + VAR_3;
    };
    FUNCTION_1(12, 2);
    FUNCTION_1(2, 2);
    FUNCTION_1(2, 3);
    FUNCTION_1(10, 5);
    FUNCTION_1(10, 30);
    }
};
