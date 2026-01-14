const Benchmark = {
    run: function() {
        function FUNCTION_3(VAR_8) {
          this.VAR_14 = VAR_8;
        }
        FUNCTION_3.prototype.FUNCTION_4 = function (VAR_9, VAR_10) {
          VAR_9[VAR_11] = VAR_8;
        };
        function FUNCTION_5(VAR_15) {
          return new FUNCTION_3(VAR_15);
        }
        var VAR_12 = 10000;
        for (var VAR_13 = 0; VAR_13 < VAR_12; VAR_13++) {
          FUNCTION_5(VAR_13);
        }
    }
};