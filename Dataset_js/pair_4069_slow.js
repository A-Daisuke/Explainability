const Benchmark = {
    run: function() {
        (function () {
          function FUNCTION_1() {
            var VAR_1 = this;
            VAR_1.VAR_2 = false;
            VAR_1.VAR_3 = false;
          }
          var VAR_4 = new FUNCTION_1();
          var VAR_5 = FUNCTION_1.prototype;
          VAR_5.FUNCTION_2 = function () {
            this.VAR_2 = true;
            console.log("Your car is driving...");
          };
          VAR_5.FUNCTION_3 = function () {
            this.VAR_3 = true;
            console.log("Your car is honking...");
          };
          VAR_4.FUNCTION_3();
          VAR_4.FUNCTION_2();
        })();
    }
};