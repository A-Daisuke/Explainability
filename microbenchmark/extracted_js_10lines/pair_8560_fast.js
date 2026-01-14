const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_6 = [];
          for (var VAR_7 = 0; VAR_7 < VAR_1.length; VAR_7++) {
            for (var VAR_8 = VAR_7 + 1; VAR_8 < VAR_1.length; VAR_8++) {
              VAR_6.push([VAR_1[VAR_7], VAR_1[VAR_8]]);
            }
          }
          return VAR_6;
        }
        FUNCTION_1(["a", "b", "c", "d", "e", "f", "g"]);
    }
};