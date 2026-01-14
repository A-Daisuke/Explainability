const Benchmark = {
    run: function() {
        function FUNCTION_1() {
          return this;
        }
        function FUNCTION_2(VAR_1, VAR_2, VAR_3, VAR_4, VAR_5, VAR_6, VAR_7) {
          return this;
        }
        var VAR_8 = Math.pow(2, 14);
        var VAR_9 = { KEY_1: "world" };
        var VAR_10 = 42;
        var VAR_11 = "hi how are ya";
        var FUNCTION_3 = function () {
          console.log("well ok");
        };
        for (var VAR_12 = 0; VAR_12 < VAR_8; ++VAR_12) {
          FUNCTION_1.bind(VAR_9)();
        }
    }
};