const Benchmark = {
    run: function() {
        var VAR_5 = {
          KEY_2: ".a",
          KEY_3: ".b",
          KEY_4: ".c",
          KEY_5: ".d",
          KEY_6: ".e",
          KEY_7: ".f",
          KEY_8: ".g",
          KEY_9: ".h",
        };
        var FUNCTION_1 = function (VAR_7) {
          return VAR_5[VAR_7];
        };
        FUNCTION_1("a");
        FUNCTION_1("b");
    }
};