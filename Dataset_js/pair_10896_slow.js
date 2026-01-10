const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: [{}, { KEY_2: { KEY_3: 3 } }],
        };
        function FUNCTION_1(VAR_2, VAR_3) {
          if (VAR_1 === undefined || VAR_1 === null) {
            return;
          }
          if (VAR_3.length === 0) {
            return VAR_1;
          }
          let VAR_4 = VAR_1[VAR_3[0]];
          let VAR_5 = VAR_3.slice(1);
          return FUNCTION_1(VAR_4, VAR_5);
        }
        var VAR_6 = FUNCTION_1(VAR_1, ["a", "1", "b", "c"]);
    }
};