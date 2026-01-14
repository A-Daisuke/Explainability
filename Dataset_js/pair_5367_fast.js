const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          this.VAR_1 = [];
          this.VAR_1["norm"] = [];
          this.FUNCTION_3 = function (VAR_8, VAR_9) {
            var VAR_10 = this.VAR_1[VAR_8];
            for (var VAR_6 = 0; VAR_6 < VAR_9; VAR_6 += 3) {
              VAR_10.push(VAR_6);
              VAR_10.push(VAR_6 + 1);
              VAR_10.push(VAR_6 + 2);
            }
          };
          this.FUNCTION_3("norm", 1000);
          return this;
        }
        var VAR_7 = new FUNCTION_1();
    }
};