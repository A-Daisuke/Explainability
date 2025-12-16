const Benchmark = {
    run: function() {
    var FUNCTION_1 = function (VAR_1, VAR_2) {
      return VAR_1 * VAR_2;
    };
    var FUNCTION_2 = function (VAR_3, VAR_4, VAR_5) {
      if (VAR_3[0] == null) {
        return VAR_5;
      }
      return FUNCTION_2(VAR_3.slice(1), VAR_4, VAR_4(VAR_3[0], VAR_5));
    };
    FUNCTION_2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], FUNCTION_1, 3);
    }
};
