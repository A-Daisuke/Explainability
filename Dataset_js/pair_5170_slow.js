const Benchmark = {
    run: function() {
        if (!Array.prototype.FUNCTION_1) {
          Array.prototype.FUNCTION_1 = function (VAR_1) {
            var VAR_2 = this.length >>> 0;
            var VAR_3 = Number(arguments[1]) || 0;
            VAR_3 = VAR_3 < 0 ? Math.ceil(VAR_3) : Math.floor(VAR_3);
            if (VAR_3 < 0) VAR_3 += VAR_2;
            for (; VAR_3 < VAR_2; VAR_3++) {
              if (VAR_3 in this && this[VAR_3] === VAR_1) return VAR_3;
            }
            return -1;
          };
        }
        var VAR_4 = ["aa", "a"];
        console.log(VAR_4.FUNCTION_1("a"));
    }
};