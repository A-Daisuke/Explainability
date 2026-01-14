const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = VAR_1.split("|");
          var VAR_3 = [555, 232];
          return Math.sqrt(
            Math.pow(parseInt(VAR_2[0]) - VAR_3[0], 2) + Math.pow(parseInt(VAR_2[1]) - VAR_3[1], 2),
          );
        }
        var VAR_4 = [
          "213|124",
          "555|124",
          "213|344",
          "213|144",
          "123|574",
          "283|924",
          "223|124",
        ];
        VAR_4.reduce(function (VAR_5, VAR_6) {
          if (FUNCTION_1(VAR_6) > 35 && FUNCTION_1(VAR_6) < FUNCTION_1(VAR_5)) {
            return VAR_6;
          }
          return VAR_5;
        });
    }
};