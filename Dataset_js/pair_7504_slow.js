const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = [];
          this.VAR_1["norm"] = [];
          var VAR_2;
          this.FUNCTION_2 = function (VAR_3, VAR_4, VAR_5) {
            VAR_2 = this.VAR_1["norm"];
            VAR_2.push(VAR_3);
            VAR_2.push(VAR_4);
            VAR_2.push(VAR_5);
          };
          for (var VAR_6 = 0; VAR_6 < 1000; VAR_6 += 3) {
            this.FUNCTION_2(VAR_6, VAR_6 + 1, VAR_6 + 2);
          }
          return this;
        }
        var VAR_7 = new FUNCTION_1();
    }
};