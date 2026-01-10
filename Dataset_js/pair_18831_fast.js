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
        var VAR_4 = 0;
        if (VAR_1.KEY_1() && VAR_2.KEY_2() && VAR_3) {
          VAR_4++;
        }
    }
};