const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: Math.random(),
          KEY_2: Math.random(),
        };
        function FUNCTION_1(VAR_2) {
          return VAR_1.KEY_1 + VAR_1.KEY_2;
        }
        FUNCTION_1({
          KEY_3: Math.random(),
          KEY_4: Math.random(),
        });
    }
};