const Benchmark = {
    run: function() {
        var FUNCTION_3 = function (VAR_3) {
          return 1;
        };
        FUNCTION_3("text");
        FUNCTION_3(108);
        FUNCTION_3(Number(5));
        FUNCTION_3([2, 5, "euou"]);
        FUNCTION_3({
          KEY_4: 1,
          KEY_5: 2,
          KEY_6: "Class1",
        });
    }
};