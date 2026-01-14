const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = {
          KEY_1: function (VAR_3, VAR_4) {
            return VAR_1.slice.call(VAR_3, VAR_4);
          },
        };
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
        var FUNCTION_1 = function () {
          var VAR_6 = VAR_2.KEY_1(arguments);
          return VAR_6
            .map(function (VAR_7) {
              return VAR_5[VAR_7];
            })
            .join(", ");
        };
        FUNCTION_1("a", "b");
    }
};