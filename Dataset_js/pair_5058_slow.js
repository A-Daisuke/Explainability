const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = "x1v1";
        }
        FUNCTION_1.VAR_2 = new (function () {
          this.VAR_3 = "x1v2";
          this.FUNCTION_2 = function X1_x1m1() {
            return "x1m1";
          };
          this.FUNCTION_3 = function X1_x1m2() {
            return "x1m2";
          };
        })();
    }
};