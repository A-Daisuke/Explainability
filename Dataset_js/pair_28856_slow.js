const Benchmark = {
    run: function() {
        var VAR_1 = [];
        var VAR_2 = [];
        for (var VAR_3 = 0; VAR_3 < 10000; VAR_3++) {
          VAR_1.push(Math.random());
          VAR_2.push(function () {
            var VAR_4 = "wewqwqewqe";
            function FUNCTION_1() {
              return "tessdfsfsfsdff";
            }
          });
        }
        var VAR_5 = {};
        for (var VAR_6 = 0; VAR_3 < 10000; VAR_3++) {
          VAR_5[VAR_2[VAR_7]] = VAR_3;
        }
    }
};