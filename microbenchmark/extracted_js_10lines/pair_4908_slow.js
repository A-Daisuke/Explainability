const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1, VAR_2, VAR_3) {
          this.VAR_4 = VAR_1;
          this.VAR_5 = VAR_2;
          this.VAR_6 = VAR_3;
          return this;
        };
        var FUNCTION_2 = function (VAR_7) {
          VAR_7[0];
        };
        var FUNCTION_3 = function (VAR_8) {
          VAR_7[1];
        };
        var FUNCTION_4 = function (VAR_9) {
          VAR_7[2];
        };
        var VAR_10 = new FUNCTION_1(10, 20, 30);
        var VAR_11 = VAR_10.VAR_4;
        var VAR_12 = VAR_10.VAR_5;
        var VAR_13 = VAR_10.VAR_6;
    }
};