const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1.KEY_1.replace(/\D/g, ""),
            VAR_3 = {
              0: "(",
              3: ") ",
              6: " - ",
            };
          VAR_1.KEY_1 = "";
          for (var VAR_4 = 0; VAR_4 < VAR_2.length; VAR_4++) {
            VAR_1.KEY_1 += (VAR_3[VAR_4] || "") + VAR_2[VAR_4];
          }
        }
        var VAR_5 = { KEY_1: "(252)-665-1229" };
        FUNCTION_1(VAR_5);
    }
};