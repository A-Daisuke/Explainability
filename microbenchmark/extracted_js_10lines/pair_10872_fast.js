const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = 1;
          var VAR_2 = 1;
          this.FUNCTION_2 = function () {
            this.VAR_1 = 2;
            this.VAR_1 += 1;
          };
          this.FUNCTION_3 = function () {
            var VAR_3 = 2;
            VAR_2 += 1;
          };
          this.FUNCTION_4 = function () {
            VAR_2 = 2;
            VAR_2 += 1;
          };
        }
        var VAR_4 = new FUNCTION_1();
        VAR_4.FUNCTION_4();
    }
};