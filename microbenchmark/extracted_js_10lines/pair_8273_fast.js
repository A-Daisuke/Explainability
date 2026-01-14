const Benchmark = {
    run: function() {
        var VAR_1 = {
          KEY_1: null,
          KEY_2: null,
          KEY_3: null,
          KEY_4: null,
        };
        function FUNCTION_1() {
          VAR_1.KEY_1 = Math.floor(Math.random() * 100);
          VAR_1.KEY_2 = Math.floor(Math.random() * 100);
          VAR_1.KEY_3 = Math.floor(Math.random() * 100);
          VAR_1.KEY_4 = Math.floor(Math.random() * 100);
        }
        FUNCTION_1();
    }
};