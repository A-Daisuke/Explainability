const Benchmark = {
    run: function() {
        var VAR_1 = [],
          VAR_2 = 0;
        var VAR_3 = 10000;
        for (var VAR_4 = 0; VAR_4 < VAR_2; VAR_4++) {
          VAR_1.push(VAR_4);
        }
        function FUNCTION_1(VAR_5) {
          VAR_2 += VAR_5;
        }
        VAR_1.forEach(FUNCTION_1);
    }
};