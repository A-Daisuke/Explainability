const Benchmark = {
    run: function() {
        var FUNCTION_1 = function () {};
        FUNCTION_1.prototype.VAR_1 = new (function () {
          this.VAR_2 = "test";
        })();
        FUNCTION_1.prototype.VAR_3 = new (function () {
          this.VAR_2 = "test";
        })();
        FUNCTION_1.prototype.VAR_4 = new (function () {
          this.VAR_2 = "test";
        })();
        var VAR_5 = new FUNCTION_1();
    }
};