const Benchmark = {
    run: function() {
        function FUNCTION_1(VAR_1) {
          var VAR_2 = [];
          VAR_2.push(VAR_1 + 1);
          VAR_2.push(VAR_1 + 2);
          VAR_2.push(VAR_1 + 3);
          VAR_2.push(VAR_1 + 4);
          VAR_2.push(VAR_1 + 5);
          VAR_2.push(VAR_1 + 6);
          return VAR_2;
        }
        for (var VAR_3 = 0; VAR_3 < 10000; ++VAR_3) FUNCTION_1(VAR_3);
    }
};