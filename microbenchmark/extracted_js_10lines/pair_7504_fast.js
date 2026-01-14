const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = [];
          this.VAR_1["norm"] = [];
          this.FUNCTION_2 = function (VAR_8, VAR_3, VAR_4, VAR_5) {
            VAR_8.push(VAR_3);
            VAR_8.push(VAR_4);
            VAR_8.push(VAR_5);
          };
          for (var VAR_6 = 0; VAR_6 < 334; ++VAR_6) {
            this.FUNCTION_2(this.VAR_1["norm"], 3 * VAR_6, 3 * VAR_6 + 1, 3 * VAR_6 + 2);
          }
          return this;
        }
        var VAR_7 = new FUNCTION_1();
    }
};