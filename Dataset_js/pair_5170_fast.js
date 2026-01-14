const Benchmark = {
    run: function() {
        if (!Array.prototype.FUNCTION_1) {
          Array.prototype.FUNCTION_1 = function (VAR_1, VAR_5) {
            for (var VAR_6 = VAR_5 || 0, VAR_2 = this.length; VAR_6 < VAR_2; VAR_6++) {
              if (this[VAR_6] === VAR_1) {
                return VAR_6;
              }
            }
            return -1;
          };
        }
        var VAR_4 = ["aa", "a"];
        console.log(VAR_4.FUNCTION_1("a"));
    }
};