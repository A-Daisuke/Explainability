const Benchmark = {
    run: function() {
        var VAR_1 = ["qwert", "asdfg", "zxcvb", "ertyu", "xcvbnm"];
        var VAR_2 = {
          KEY_1: true,
          KEY_2: false,
          KEY_3: true,
          KEY_4: false,
          KEY_5: true,
        };
        function FUNCTION_1(VAR_3) {
          return VAR_2[VAR_3];
        }
        for (var VAR_4 = 0; VAR_4 < VAR_1.length; ++VAR_4) {
          if (!FUNCTION_1(VAR_1[VAR_4])) {
            VAR_1.splice(VAR_4--, 1);
          }
        }
    }
};