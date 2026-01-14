const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        FUNCTION_1.prototype.VAR_1 = 1;
        FUNCTION_1.prototype.VAR_2 = "1";
        FUNCTION_1.prototype.FUNCTION_2 = function (VAR_3) {
          this.VAR_1 = VAR_3;
        };
        FUNCTION_1.prototype.FUNCTION_3 = function () {
          return this.VAR_1;
        };
        var FUNCTION_4 = function () {
          this.VAR_1 = 1;
          this.VAR_2 = "2";
          this.FUNCTION_5 = function (VAR_4) {
            this.VAR_1 = VAR_3;
          };
          this.FUNCTION_6 = function () {
            return this.VAR_1;
          };
        };
        new FUNCTION_4();
    }
};