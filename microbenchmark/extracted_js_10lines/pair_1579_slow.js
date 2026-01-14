const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          this.VAR_3 = "force";
          this.VAR_4 = VAR_1;
          this.VAR_5 = !!VAR_2;
        }
        function FUNCTION_2(VAR_6, VAR_7) {
          return new FUNCTION_1(VAR_6, VAR_7);
        }
        function FUNCTION_3(VAR_8) {
          this.VAR_4 = VAR_8;
        }
        FUNCTION_3.prototype.FUNCTION_4 = function (VAR_9, VAR_10) {
          VAR_9[VAR_11] = VAR_1;
        };
        var VAR_12 = 10000;
        for (var VAR_13 = 0; VAR_13 < VAR_12; VAR_13++) {
          FUNCTION_2(VAR_13, false);
        }
    }
};