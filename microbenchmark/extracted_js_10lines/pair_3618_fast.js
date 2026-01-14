const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          return 1 / VAR_1;
        }
        VAR_2 = [];
        for (var VAR_3 = 0; VAR_3 < 10000; ++VAR_3) {
          VAR_2.push(Math.random() + 1);
        }
        VAR_4 = [];
        for (var VAR_5 = 0; VAR_3 < VAR_2.length; ++VAR_3) {
          VAR_4.push(FUNCTION_1(VAR_2[VAR_3]));
        }
    }
};