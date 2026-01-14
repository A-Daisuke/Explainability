const Benchmark = {
    run: function() {
        var VAR_1 = [0, 3.1415, false, "1", {}, [], Infinity, NaN];
        var VAR_2 = Object.prototype.VAR_2;
        function FUNCTION_1(VAR_3) {
          return !isNaN(VAR_3) && isFinite(VAR_3) && typeof VAR_3 === "number";
        }
        function FUNCTION_2(VAR_4) {
          return !isNaN(VAR_4) && isFinite(VAR_4) && VAR_2.call(VAR_4) == "[object Number]";
        }
        for (var VAR_5 = 0; VAR_5 < VAR_1.length; VAR_5++) {
          FUNCTION_1(VAR_1[VAR_5]);
        }
    }
};