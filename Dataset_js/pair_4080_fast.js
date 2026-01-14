const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = "a";
          this.VAR_2 = "b";
          this.VAR_3 = new Array();
          this.VAR_4 = new Object();
          this.VAR_5 = new (function () {
            this.VAR_1 = "a";
            this.VAR_2 = new (function () {
              this.VAR_1 = "a";
            })();
          })();
        }
        var VAR_6 = Object.create(FUNCTION_1);
    }
};