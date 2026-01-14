const Benchmark = {
    run: function() {
        var FUNCTION_1 = function (VAR_1) {
          if (VAR_1 instanceof Array) return 1;
          else return 0;
        };
        FUNCTION_1("text");
        FUNCTION_1(108);
        FUNCTION_1(Number(5));
        FUNCTION_1([2, 5, "euou"]);
        FUNCTION_1({
          KEY_1: 1,
          KEY_2: 2,
          KEY_3: 3,
        });
        var FUNCTION_2 = function (VAR_2) {
          if (typeof VAR_1.pop === "function") return 1;
          else return 0;
        };
        FUNCTION_1("text");
        FUNCTION_1(108);
        FUNCTION_1(Number(5));
        FUNCTION_1([2, 5, "euou"]);
        FUNCTION_1({
          KEY_4: 1,
          KEY_5: 2,
          KEY_6: "Class1",
        });
    }
};