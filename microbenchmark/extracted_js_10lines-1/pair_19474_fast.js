const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: Math.random(),
          KEY_2: Math.random(),
        };
        var VAR_3 = Math.random();
        var VAR_4 = Math.random();
        function FUNCTION_1(VAR_2, VAR_5) {
          return VAR_3 + VAR_4;
        }
        FUNCTION_1(VAR_3, VAR_4);
    }
};