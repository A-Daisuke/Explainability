const Benchmark = {
    run: function() {
        var VAR_1 = "scissors".split("");
        Array.prototype.FUNCTION_1 = function (VAR_2) {
          var VAR_3 = [];
          for (var VAR_4 = this.length - 1; VAR_4 >= 0; VAR_4--) {
            if (this[VAR_4] === VAR_2) {
              VAR_3.push(VAR_4);
            }
          }
          return VAR_3;
        };
        VAR_1.FUNCTION_1("s");
    }
};