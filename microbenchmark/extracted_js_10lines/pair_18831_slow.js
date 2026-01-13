const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: function () {
            return true;
          },
        };
        var VAR_2 = {
          KEY_2: function () {
            return false;
          },
        };
        var VAR_3 = true;
        function FUNCTION_1() {
          return VAR_1.KEY_1() && VAR_2.KEY_2() && VAR_3;
        }
        var VAR_4 = 0;
        if (FUNCTION_1()) {
          VAR_4++;
        }
    }
};