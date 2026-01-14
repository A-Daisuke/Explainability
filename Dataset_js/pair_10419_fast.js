const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return VAR_1 * 42;
        }
        Array.prototype.FUNCTION_2 = function () {
          return "swag";
        };
        var VAR_2 = [11 / 6, 5, 10, 15];
        var VAR_4 = VAR_2.length;
        for (var VAR_5 = 0; VAR_5 < VAR_4; VAR_5++) {
          FUNCTION_1(VAR_2[VAR_5]);
        }
    }
};