const Benchmark = {
    run: function() {
        var VAR_1 = 10;
        var VAR_2 = [];
        for (var VAR_3 = 0; VAR_3 < VAR_1; VAR_3++) {
          VAR_2.push(VAR_3);
        }
        function FUNCTION_1(VAR_4) {
          for (var VAR_5 = 0; VAR_3 < VAR_2.length; VAR_3++) {
            if (VAR_2[VAR_3] === VAR_4) {
              return true;
            }
          }
          return false;
        }
        for (var VAR_6 = 0; VAR_3 < VAR_1; VAR_3++) {
          FUNCTION_1(VAR_3);
        }
    }
};