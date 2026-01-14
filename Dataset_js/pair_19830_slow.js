const Benchmark = {
    run: function() {
        var VAR_1 = 1;
        function FUNCTION_1() {
          VAR_1 = VAR_1 > 0 ? VAR_1 - 1 : 50;
        }
        var VAR_2 = [FUNCTION_1];
        function FUNCTION_2() {
          VAR_2[0]();
        }
        function FUNCTION_3() {
          var VAR_3 = 0,
            VAR_4 = VAR_2.length;
          while (VAR_3 < VAR_4) {
            VAR_2[VAR_3++]();
          }
        }
        function FUNCTION_4() {
          var VAR_5 = 0,
            VAR_6 = VAR_2.length;
          while (VAR_5 < VAR_6) {
            VAR_2[VAR_5++].call(this);
          }
        }
        FUNCTION_3();
    }
};