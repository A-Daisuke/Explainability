const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return this;
        }
        var VAR_1 = Math.pow(2, 14);
        var VAR_2 = { KEY_1: "world" };
        var VAR_3 = 42;
        var VAR_4 = "hi how are ya";
        for (var VAR_5 = 0; VAR_5 < VAR_1; ++VAR_5) {
          FUNCTION_1.bind(VAR_2);
        }
    }
};