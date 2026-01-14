const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = 1000000;
        var VAR_3 = 0;
        var VAR_4 = VAR_2 / 2;
        var VAR_5 = VAR_2 - 1;
        for (var VAR_6 = 0; VAR_6 < VAR_2; VAR_6++) {
          VAR_1.push(VAR_6);
        }
        function FUNCTION_1(VAR_7, VAR_8) {
          var VAR_9;
          for (var VAR_10 = 0; VAR_6 < VAR_8.length; VAR_6++) {
            if (VAR_7 === VAR_8[VAR_6]) {
              VAR_9 = VAR_6;
              break;
            }
          }
          return VAR_9;
        }
        VAR_1.includes(VAR_3);
        VAR_1.includes(VAR_4);
        VAR_1.includes(VAR_5);
    }
};