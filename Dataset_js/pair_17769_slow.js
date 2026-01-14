const Benchmark = {
    run: function() {
        var VAR_1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        function FUNCTION_1() {}
        function FUNCTION_2(VAR_2, VAR_3) {
          return function (VAR_4, VAR_5, VAR_6) {
            return VAR_2.call(VAR_3, VAR_4, VAR_5, VAR_6);
          };
        }
        var VAR_7 = VAR_1.length,
          VAR_8 = this,
          VAR_9 = VAR_7;
        for (var VAR_10 = 0; VAR_9--; VAR_10++) {
          FUNCTION_1.call(VAR_8, VAR_1[VAR_10], VAR_10, VAR_1);
        }
    }
};