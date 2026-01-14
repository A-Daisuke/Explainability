const Benchmark = {
    run: function() {
        var VAR_1 = {};
        var VAR_2 = true;
        var VAR_3 = false;
        var VAR_4 = VAR_1;
        var VAR_5 = {};
        var FUNCTION_1 = function (VAR_7) {
          return VAR_2 !== false && VAR_2 !== VAR_1;
        };
        if (VAR_2) {
          2;
        }
    }
};