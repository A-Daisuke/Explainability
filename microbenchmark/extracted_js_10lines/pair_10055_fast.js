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
        var VAR_5 = -1,
          VAR_6 = VAR_1.length;
        while (++VAR_5 != VAR_6) {
          VAR_3 = VAR_3 + VAR_5 + " = " + VAR_1[VAR_5] + " (" + FUNCTION_1(VAR_1[VAR_5]) + "), ";
        }
    }
};