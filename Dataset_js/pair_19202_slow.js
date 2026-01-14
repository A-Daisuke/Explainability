const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
          KEY_4: "d",
          KEY_5: true,
        };
        var VAR_2 = {
          KEY_6: 1,
          KEY_7: 2,
          KEY_8: 3,
          KEY_9: "d",
          KEY_10: false,
        };
        function FUNCTION_1(VAR_3, VAR_4) {
          return (
            VAR_3.KEY_1 !== VAR_4.KEY_1 ||
            VAR_3.KEY_2 !== VAR_4.KEY_2 ||
            VAR_3.KEY_3 !== VAR_4.KEY_3 ||
            VAR_3.KEY_4 !== VAR_4.KEY_4 ||
            VAR_3.KEY_5 !== VAR_4.KEY_5
          );
        }
        FUNCTION_1(VAR_1, VAR_2);
    }
};