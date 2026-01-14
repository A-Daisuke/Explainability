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
        VAR_1 = VAR_1.filter(FUNCTION_1);
    }
};