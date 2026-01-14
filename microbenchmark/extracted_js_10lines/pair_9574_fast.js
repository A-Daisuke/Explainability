const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3, 8];
        var VAR_2 = [3, 2, 8, 5];
        var VAR_3 = ["Jane", "Kenny", "Thomas", "Kelvin"];
        var VAR_4 = ["Arron", "Jane", "Kelvin", "Nick"];
        function FUNCTION_1(VAR_5, VAR_6) {
          var VAR_7 = 0;
          for (var VAR_8 = 0; VAR_8 < VAR_5.length; VAR_8++) {
            for (var VAR_9 = 0; VAR_9 < VAR_6.length; VAR_9++) {
              if (VAR_5[VAR_8] === VAR_6[VAR_9]) {
                VAR_7++;
              }
            }
          }
          return VAR_7;
        }
        FUNCTION_1(VAR_1, VAR_2);
        FUNCTION_1(VAR_3, VAR_4);
    }
};