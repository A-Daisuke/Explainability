const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_6, VAR_7, VAR_8, VAR_9, VAR_10, VAR_11, VAR_12) {
          return this;
        }
        var VAR_1 = Math.pow(2, 14);
        var VAR_3 = 42;
        var VAR_4 = "hi how are ya";
        var FUNCTION_2 = function () {
          console.log("well ok");
        };
        for (var VAR_5 = 0; VAR_5 < VAR_1; ++VAR_5) {
          FUNCTION_1.bind(FUNCTION_2);
        }
    }
};