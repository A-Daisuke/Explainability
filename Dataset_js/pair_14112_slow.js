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
        var VAR_5 =
          Math.acos(
            Math.sin(FUNCTION_1(VAR_1.KEY_1)) * Math.sin(FUNCTION_1(VAR_2.KEY_1)) +
              Math.cos(FUNCTION_1(VAR_1.KEY_1)) *
                Math.cos(FUNCTION_1(VAR_2.KEY_1)) *
                Math.cos(FUNCTION_1(VAR_2.KEY_2 - VAR_1.KEY_2)),
          ) * VAR_3;
    }
};