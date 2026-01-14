const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: [{}, { KEY_2: { KEY_3: 3 } }],
        };
        function FUNCTION_1(VAR_2, VAR_3) {
          var VAR_7,
            VAR_8 = VAR_3.length;
          for (VAR_7 = 0; typeof VAR_2 === "object" && VAR_7 < VAR_8; ++VAR_7) {
            VAR_2 = VAR_2[VAR_3[VAR_7]];
          }
          return VAR_2;
        }
        var VAR_6 = FUNCTION_1(VAR_1, ["a", "1", "b", "c"]);
    }
};