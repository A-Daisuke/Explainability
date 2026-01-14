const Benchmark = {
    run: function() {
        var VAR_1 = [
          false,
          1,
          "2",
          "three",
          { KEY_1: 4 },
          [5],
          /six/,
          String("7"),
          "8".toString(),
          !"nine",
          true,
        ];
        function FUNCTION_1(VAR_2) {
          return VAR_2.toString();
        }
        var VAR_3 = "";
        for (var VAR_4 = 0, VAR_5 = VAR_1.length; VAR_4 < VAR_5; ++VAR_4) {
          VAR_3 = VAR_3 + VAR_4 + " = " + VAR_1[VAR_4] + " (" + FUNCTION_1(VAR_1[VAR_4]) + "), ";
        }
    }
};