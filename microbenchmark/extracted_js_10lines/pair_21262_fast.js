const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1, VAR_2) {
          var VAR_5 = VAR_1.KEY_1 - VAR_2.KEY_1,
            VAR_6 = VAR_1.KEY_2 - VAR_2.KEY_2;
          return Math.sqrt(VAR_5 * VAR_5 + VAR_6 * VAR_6);
        }
        var VAR_3 = {
            KEY_1: 3,
            KEY_2: 5,
          },
          VAR_4 = {
            KEY_3: 2,
            KEY_4: 6,
          };
        FUNCTION_1(VAR_3, VAR_4);
    }
};