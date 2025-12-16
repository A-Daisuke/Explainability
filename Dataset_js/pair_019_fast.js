const Benchmark = {
    run: function() {
    function FUNCTION_1() {
      var VAR_1 = undefined;
    }
    var VAR_2 = 10000;
    function FUNCTION_2(VAR_8) {
      var VAR_3 = VAR_8;
    }
    function FUNCTION_3(VAR_5) {
      var VAR_6 = VAR_5;
      for (var VAR_7 = 1; VAR_7 < VAR_2; VAR_7++) if (VAR_6);
    }
    FUNCTION_2();
    }
};
