const Benchmark = {
    run: function() {
        var VAR_1 = {
            KEY_1: 40,
            KEY_2: -73,
          },
          VAR_2 = {
            KEY_3: 40.7419,
            KEY_4: -73.993,
          },
          VAR_3 = 6371000;
        function FUNCTION_1(VAR_4) {
          return (VAR_4 / 180) * Math.PI;
        }
        var VAR_6 = FUNCTION_1(VAR_2.KEY_1 - VAR_1.KEY_1);
        var VAR_7 = FUNCTION_1(VAR_2.KEY_2 - VAR_1.KEY_2);
        var VAR_5 = VAR_7 * Math.cos(FUNCTION_1((VAR_2.KEY_1 + VAR_1.KEY_1) / 2));
        var VAR_8 = Math.sqrt(VAR_5 * VAR_5 + VAR_6 * VAR_6) * VAR_3;
    }
};