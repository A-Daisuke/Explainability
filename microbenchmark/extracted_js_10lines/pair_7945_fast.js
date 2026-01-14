const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3, 8];
        var VAR_2 = [3, 2, 8, 5];
        var VAR_3 = ["Jane", "Kenny", "Thomas", "Kelvin"];
        var VAR_4 = ["Arron", "Jane", "Kelvin", "Nick"];
        function FUNCTION_1(VAR_5, VAR_6) {
          var VAR_11 = 0;
          var VAR_12 = VAR_1.length;
          var VAR_13 = VAR_2.length;
          for (var VAR_14 = 0; VAR_14 < VAR_12; VAR_14++) {
            for (var VAR_15 = 0; VAR_15 < VAR_13; VAR_15++) {
              if (VAR_1[VAR_14] === VAR_2[VAR_15]) {
                VAR_11++;
              }
            }
          }
          return VAR_11;
        }
        FUNCTION_1(VAR_1, VAR_2);
        FUNCTION_1(VAR_3, VAR_4);
    }
};