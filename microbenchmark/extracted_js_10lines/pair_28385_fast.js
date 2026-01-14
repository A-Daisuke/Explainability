const Benchmark = {
    run: function() {
        var VAR_1 = [];
        VAR_1[100000] = 1;
        var VAR_2 = {};
        VAR_2[100000] = 1;
        var VAR_3 = 0;
        function FUNCTION_1(VAR_4, VAR_5) {
          if (VAR_5 != undefined) return ++VAR_3;
          return 0;
        }
        var VAR_8 = Object.keys(VAR_2);
        var VAR_6 = 0;
        for (var VAR_9 = 0; VAR_9 < VAR_8.length; VAR_9++) {
          VAR_6 += VAR_2[VAR_8[VAR_9]];
        }
    }
};