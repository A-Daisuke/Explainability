const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var FUNCTION_1 = function () {
          this.FUNCTION_2 = function () {};
        };
        for (var VAR_2 = 0; VAR_2 < 2000; VAR_2++) {
          VAR_1.push(new FUNCTION_1());
        }
        VAR_1.forEach(function (VAR_3) {
          VAR_3.FUNCTION_2.call(VAR_3);
        });
    }
};