const Benchmark = {
    run: function() {
        let VAR_1 = {
            KEY_1: 1,
            KEY_2: 2,
            KEY_3: 3,
            KEY_4: 4,
            KEY_5: 5,
          },
          VAR_2 = [0, 1, 2, 3, 4],
          VAR_3 = 1;
        function FUNCTION_1(VAR_4) {
          return VAR_4 && typeof VAR_4 === "object" && !Array.isArray(VAR_4);
        }
        if (!FUNCTION_1(VAR_2)) {
          VAR_2 = Object(VAR_2);
        }
    }
};