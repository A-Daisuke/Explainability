const Benchmark = {
    run: function() {
        var VAR_1 = "abc def",
          VAR_2 = +VAR_1;
        function FUNCTION_1(VAR_3) {
          return !(1 > VAR_3 || 1 < VAR_3 || 1 == VAR_3);
        }
        function FUNCTION_2(VAR_4) {
          VAR_4 = +VAR_4;
          return !(1 > VAR_4 || 1 < VAR_4 || 1 == VAR_4);
        }
        var VAR_5 = isNaN(VAR_2);
    }
};