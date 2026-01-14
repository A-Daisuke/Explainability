const Benchmark = {
    run: function() {
        var VAR_1 = [1, 2, 3, 8];
        var VAR_2 = [3, 2, 8, 5];
        var VAR_3 = ["Jane", "Kenny", "Thomas", "Kelvin"];
        var VAR_4 = ["Arron", "Jane", "Kelvin", "Nick"];
        function FUNCTION_1(VAR_5, VAR_6) {
          var VAR_7 = [];
          for (var VAR_8 = 0; VAR_8 < VAR_1.length; VAR_8++) {
            for (var VAR_9 = 0; VAR_9 < VAR_2.length; VAR_9++) {
              if (VAR_1[VAR_8] === VAR_2[VAR_9]) {
                VAR_7.push(VAR_1[VAR_8]);
              }
            }
          }
          return VAR_7.length;
        }
        FUNCTION_1(VAR_1, VAR_2);
        FUNCTION_1(VAR_3, VAR_4);
    }
};