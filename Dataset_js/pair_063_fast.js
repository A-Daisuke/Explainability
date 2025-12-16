const Benchmark = {
    run: function() {
    var VAR_1 = [true, true, true, true, true, true];
    var VAR_2 = [true, false, true, true, true, false];
    function FUNCTION_1() {
      var VAR_3;
      for (VAR_3 = 0; VAR_3 < VAR_1.length; ++VAR_3) {
        if (!VAR_1[VAR_3]) {
          return VAR_1[VAR_3];
        }
      }
      for (VAR_3 = 0; VAR_3 < VAR_2.length; ++VAR_3) {
        if (!VAR_2[VAR_3]) {
          return VAR_2[VAR_3];
        }
      }
      return true;
    }
    FUNCTION_1();
    }
};
