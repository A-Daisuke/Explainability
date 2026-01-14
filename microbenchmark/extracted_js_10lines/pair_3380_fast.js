const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var FUNCTION_1 = function () {
          this.FUNCTION_2 = function () {};
        };
        for (var VAR_2 = 0; VAR_2 < 2000; VAR_2++) {
          VAR_1.push(new FUNCTION_1());
        }
        for (var VAR_4 = 0; VAR_4 < VAR_1.length; VAR_4++) {
          VAR_1[VAR_4].FUNCTION_2();
        }
    }
};