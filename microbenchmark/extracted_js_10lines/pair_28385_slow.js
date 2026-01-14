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
        var VAR_6 = 0;
        for (var VAR_7 in VAR_2) {
          VAR_6 += 1;
        }
    }
};